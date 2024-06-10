import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, map } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Group, GroupType } from '../data/Group';
import { History } from '../data/History';
import { User } from '../data/User';
import { HistoryApiActions } from '../store/history/history-api.actions';
import { selectMessageSending } from '../store/multi-feature.selectors';
import { GroupApiActions } from '../store/group/group-api.actions';
import { groupFeature } from '../store/group/group.reducer';
import { UserApiActions } from '../store/user/user-api.actions';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = 'localhost:3000';
  socket!: Socket;

  store = inject(Store);

  groupSockets = new Map<string, Socket>();

  constructor() {
    this.connect();
    this.socket.on(
      'groupsList',
      ({ groups, users }: { groups: Group[]; users: User[] }) => {
        // TODO When reconnecting, probably should keep the state of the APP
        this.store.dispatch(UserApiActions.usersLoadedSuccess({ users }));

        this.store.dispatch(
          GroupApiActions.groupsLoadedSuccess({
            groups: groups,
          })
        );

        // this.store.dispatch(
        //   PrivateChannelApiActions.privateChannelLoadedSuccess({ pri: groups[0] })
        // );

        groups.forEach((group) => {
          if (this.groupSockets.has(group._id)) return;

          this.groupSockets.set(group._id, io(this.url + '/' + group._id));
          this.groupSockets
            .get(group._id)
            ?.on('history', (res: { id: string; histories: History[] }) => {
              this.store.dispatch(HistoryApiActions.historyLoadedSuccess(res));
            });

          this.groupSockets.get(group._id)?.io.on('reconnect', () => {
            const that = this;
            // debugger;
            console.debug('reconnect group', that.socket.active);
            console.log('what the fuck?', this.groupSockets.get(group._id));
            console.log("this.groupSockets.get(group._id)?.io.on('reconnect',");
          });

          this.groupSockets
            .get(group._id)
            ?.io.on('reconnect_attempt', (attempt) => {
              console.log('socket: ', group._id, 'attempt:', attempt);
            });

          this.groupSockets.get(group._id)?.io.on('reconnect_failed', () => {
            console.log('reconnect failed');
          });

          this.groupSockets.get(group._id)?.on('connect_error', (error) => {
            if (this.groupSockets.get(group._id)?.active) {
              // temporary failure, the socket will automatically try to reconnect
            } else {
              // the connection was denied by the server
              // in that case, `socket.connect()` must be manually called in order to reconnect
              console.log('Error??', error.message);
            }
          });

          this.groupSockets.get(group._id)?.on('connect', () => {
            console.log('number of room', group.rooms.length);
          });

          this.groupSockets
            .get(group._id)
            ?.on(
              'broadcastMessage',
              (res: { id: string; history: History }) => {
                this.store.dispatch(HistoryApiActions.historyReceived(res));
              }
            );
        });
      }
    );

    this.socket.on('connect', () => {
      console.log('initial connect', this.socket.id);
      const that = this;
      //   debugger;
    });
    this.socket.on('findUserResponse', (response) => {
      this.store.dispatch(
        UserApiActions.loadLoggedInUser({ userId: response.user._id })
      );
    });

    this.socket.on('reconnect', (res) => {
      console.log('this socket reconnect', res);
    });

    this.socket.io.on('reconnect', (res) => {
      console.log('this socket io reconnect', res, this.socket.id);
    });

    this.socket.on('privateChatChannelCreated', (response) => {
      this.store
        .select(groupFeature.selectGroupByType(GroupType.private))
        .pipe(first())
        .subscribe((groups) => {
          const privateChannel = response.privateChannel;
          privateChannel.group = groups[0];
          this.store.dispatch(
            GroupApiActions.privateChannelCreatedSuccess({
              room: privateChannel,
            })
          );
        });

      this.store.dispatch(
        HistoryApiActions.historyLoadedSuccess({
          id: response.privateChannel._id.toString(),
          histories: [],
        })
      );
    });

    this.socket.on('history', (res: { id: string; histories: History[] }) => {
      this.store.dispatch(HistoryApiActions.historyLoadedSuccess(res));
    });

    this.socket.on('privateChannelsLoaded', (response) => {
      this.store.dispatch(
        GroupApiActions.privateChannelsLoadedSuccess({
          group: response.privateGroup,
          rooms: response.privateChannels,
        })
      );
    });
    this.socket.on('loginSuccess', () => {
      console.log('Login Success');
    });

    this.socket.on(
      'broadcastMessage',
      (res: { id: string; history: History }) => {
        console.log('message received', res);
        this.store.dispatch(HistoryApiActions.historyReceived(res));
      }
    );

    this.socket.on('logoutSuccess', () => {
      console.log('Log out Success');
    });
  }

  connect() {
    this.socket = io(this.url);
  }

  login(userId: string) {
    this.socket.emit('login', { userId });
  }

  logout(userId: string) {
    console.log('log out called');
    this.socket.emit('logout', { userId });
  }

  getChatrooms(groupName: string) {
    return this.store.select(groupFeature.selectAll).pipe(
      //   filter((groups) => groups.length != 0),
      map((groups) => {
        return groups.filter((group) => group.name == groupName);
      })
    );
  }

  findUser(username: string) {
    this.socket.emit('findUser', { username: username });
  }

  //   openGroup(groupId: string) {
  //     this.store
  //       .select(statusFeature.selectGroups)
  //       .pipe(
  //         first(),
  //         map((groups) => {
  //           const group = groups.filter((group) => group._id == groupId)[0];
  //           this.store.dispatch(StatusApiActions.groupLoadedSuccess({ group }));
  //         })
  //       )
  //       .subscribe();
  //   }

  send(message: string) {
    this.store
      .select(selectMessageSending)
      .pipe(first())
      .subscribe(
        ({
          activatedGroup,
          joinedRoom,
          user,
          isPrivateMessage,
        }: {
          activatedGroup: string | null;
          joinedRoom: string | null;
          user: User | undefined;
          isPrivateMessage: boolean;
        }) => {
          if (!isPrivateMessage) {
            this.groupSockets.get(activatedGroup!)?.emit('newMessage', {
              message: message,
              user: user,
              roomId: joinedRoom,
              time: new Date(Date.now()),
            });
          } else {
            this.socket.emit('newMessage', {
              message: message,
              user: user,
              roomId: joinedRoom,
              time: new Date(Date.now()),
            });
          }
        }
      );
  }

  createPrivateChannel(currentUser: string, user: string) {
    this.socket.emit('onPrivateChatCreation', { creator: currentUser, user });
  }

  loadPrivateChannels(userId: string) {
    this.socket.emit('loadPrivateChannels', { userId });
  }
}
