import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, first, map } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Group } from '../data/Group';
import { History } from '../data/History';
import { HistoryApiActions } from '../store/history/history-api.actions';
import { hisotryFeature } from '../store/history/history.reducer';
import { StatusApiActions } from '../store/status/status-api.actions';
import { statusFeature } from '../store/status/status.reducer';
import { User } from '../data/User';
import { UserApiActions } from '../store/user/user-api.actions';
import { userFeature } from '../store/user/user.reducer';
import { PrivateChannel } from '../data/PrivateChannel';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = '192.168.1.33:3000';
  socket!: Socket;

  store = inject(Store);

  groupSockets = new Map<string, Socket>();

  constructor() {
    this.connect();
    this.socket.on(
      'groupsList',
      ({ groups, users }: { groups: Group[]; users: User[] }) => {
        this.store.dispatch(UserApiActions.usersLoadedSuccess({ users }));
        this.store.dispatch(StatusApiActions.groupsLoadedSuccess({ groups }));
        this.store.dispatch(
          StatusApiActions.groupLoadedSuccess({ group: groups[0] })
        );

        groups.forEach((group) => {
          if (!this.groupSockets.has(group._id)) {
            this.groupSockets.set(group._id, io(this.url + '/' + group._id));
            this.groupSockets
              .get(group._id)
              ?.on('history', (res: { id: string; histories: History[] }) => {
                this.store.dispatch(
                  HistoryApiActions.historyLoadedSuccess(res)
                );
              });
            this.groupSockets
              .get(group._id)
              ?.on(
                'broadcastMessage',
                (res: { id: string; history: History }) => {
                  console.log('message received', res);
                  this.store.dispatch(
                    HistoryApiActions.historyAddedSuccess(res)
                  );
                }
              );
          }
        });
      }
    );

    this.socket.on('findUserResponse', (response) => {
      this.store.dispatch(
        UserApiActions.loadLoggedInUser({ userId: response.user._id })
      );
    });

    this.socket.on('privateChatChannelCreated', (response) => {
      this.store.dispatch(
        StatusApiActions.privateChannelCreatedSuccess({
          privateChannel: response.privateChannel,
        })
      );
    });

    this.socket.on('history', (res: { id: string; histories: History[] }) => {
      this.store.dispatch(HistoryApiActions.historyLoadedSuccess(res));
    });

    this.socket.on('privateChannelsLoaded', (response) => {
      this.store.dispatch(
        StatusApiActions.privateChannelLoadedSuccess({
          privateChannels: response.privateChannels,
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
        this.store.dispatch(HistoryApiActions.historyAddedSuccess(res));
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
    return this.store.select(statusFeature.selectGroups).pipe(
      filter((groups) => groups.length != 0),
      map((groups) => {
        return groups.filter((group) => group.name == groupName)[0].rooms;
      })
    );
  }

  findUser(username: string) {
    this.socket.emit('findUser', { username: username });
  }

  openGroup(groupId: string) {
    this.store
      .select(statusFeature.selectGroups)
      .pipe(
        first(),
        map((groups) => {
          const group = groups.filter((group) => group._id == groupId)[0];
          this.store.dispatch(StatusApiActions.groupLoadedSuccess({ group }));
        })
      )
      .subscribe();
  }

  async joinRoom(groupId: string, roomId: string) {
    await this.groupSockets.get(groupId)?.emitWithAck('joinRoom', roomId);
    this.store.dispatch(StatusApiActions.roomLoadedSuccess({ roomId: roomId }));
  }

  send(message: string) {
    this.store
      .select(statusFeature.selectStatusState)
      .pipe(first())
      .subscribe((state) => {
        this.store
          .select(userFeature.selectUserById)
          .pipe(first())
          .subscribe((user) => {
            if (!!state.activatedGroup) {
              this.groupSockets
                .get(state.activatedGroup!._id.toString())
                ?.emit('newMessage', {
                  message: message,
                  user: user,
                  roomId: state.joinedRoom,
                  time: new Date(Date.now()),
                });
            } else {
              this.socket.emit('newMessage', {
                message: message,
                user: user,
                roomId: state.joinedRoom,
                time: new Date(Date.now()),
              });
            }
          });
      });
  }

  createPrivateChannel(currentUser: string, user: string) {
    this.socket.emit('onPrivateChatCreation', { creator: currentUser, user });
  }

  loadPrivateChannels(userId: string) {
    this.socket.emit('loadPrivateChannels', { userId });
  }
}
