import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Group, GroupType } from '../data/Group';
import { History } from '../data/History';
import { User } from '../data/User';
import { GroupApiActions } from '../store/group/group-api.actions';
import { groupFeature } from '../store/group/group.reducer';
import { HistoryApiActions } from '../store/history/history-api.actions';
import { selectMessageSending } from '../store/multi-feature.selectors';
import { UserApiActions } from '../store/user/user-api.actions';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = 'localhost:3000';
  socket!: Socket;

  store = inject(Store);

  groupSockets = new Map<string, Socket>();

  privateGroupSocket?: Socket;

  initGroup(group: Group) {
    if (this.groupSockets.has(group._id)) return;

    this.groupSockets.set(group._id, io(this.url + '/' + group._id));

    this.groupSockets
      .get(group._id)
      ?.on('history', (res: { id: string; histories: History[] }) => {
        this.store.dispatch(HistoryApiActions.historyLoadedSuccess(res));
      });

    this.groupSockets
      .get(group._id)
      ?.on('broadcastMessage', (res: { id: string; history: History }) => {
        this.store.dispatch(HistoryApiActions.historyReceived(res));
      });

    if (group.type == GroupType.private) {
      this.privateGroupSocket = this.groupSockets.get(group._id);
      this.privateGroupSocket!.on('loginSuccess', (userId) => {
        this.store.dispatch(UserApiActions.loadLoggedInUser({ userId }));
        this.loadPrivateChannels(userId);
      });

      this.privateGroupSocket!.on('privateChatChannelCreated', (response) => {
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

      this.privateGroupSocket!.on('privateChannelsLoaded', (response) => {
        this.store.dispatch(
          GroupApiActions.privateChannelsLoadedSuccess({
            group: response.privateGroup,
            rooms: response.privateChannels,
          })
        );

        this.initGroup(response.privateGroup);
      });

      this.privateGroupSocket!.on('logoutSuccess', () => {
        console.log('Log out Success');
      });
    }
  }

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

        groups.forEach((group) => this.initGroup(group));
      }
    );

    this.socket.on('findUserResponse', (response) => {
      this.store.dispatch(
        UserApiActions.loadLoggedInUser({ userId: response.user._id })
      );
    });

    this.socket.on(
      'broadcastMessage',
      (res: { id: string; history: History }) => {
        this.store.dispatch(HistoryApiActions.historyReceived(res));
      }
    );
  }

  connect() {
    this.socket = io(this.url);
  }

  login(userId: string) {
    this.privateGroupSocket!.emit('login', { userId });
  }

  logout(userId: string) {
    this.privateGroupSocket!.emit('logout', { userId });
  }

  findUser(username: string) {
    this.socket.emit('findUser', { username: username });
  }

  send(message: string) {
    this.store
      .select(selectMessageSending)
      .pipe(first())
      .subscribe(
        ({
          activatedGroup,
          joinedRoom,
          user,
        }: {
          activatedGroup: string | null;
          joinedRoom: string | null;
          user: User | undefined;
        }) => {
          this.groupSockets.get(activatedGroup!)?.emit('newMessage', {
            message: message,
            user: user,
            roomId: joinedRoom,
            time: new Date(Date.now()),
          });
        }
      );
  }

  createPrivateChannel(currentUser: string, user: string) {
    this.privateGroupSocket!.emit('onPrivateChatCreation', {
      creator: currentUser,
      user,
    });
  }

  loadPrivateChannels(userId: string) {
    this.privateGroupSocket!.emit('loadPrivateChannels', { userId });
  }
}
