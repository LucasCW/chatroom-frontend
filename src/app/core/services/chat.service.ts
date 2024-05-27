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

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = '192.168.1.33:3000';
  socket!: Socket;

  store = inject(Store);

  groupSockets = new Map<string, Socket>();

  currentRoomId!: string;

  constructor() {
    this.connect();
    this.socket.on('groupsList', ({ groups }: { groups: Group[] }) => {
      this.store.dispatch(StatusApiActions.groupsLoadedSuccess({ groups }));
      this.store.dispatch(
        StatusApiActions.groupLoadedSuccess({ group: groups[0] })
      );

      groups.forEach((group) => {
        if (!this.groupSockets.has(group._id)) {
          this.groupSockets.set(group._id, io(this.url + '/' + group._id));
          this.groupSockets.get(group._id)?.on('message', (res) => {
            console.log('message: ' + res);
          });
          this.groupSockets.get(group._id)?.on('history', (res: History[]) => {
            console.log('history: ' + res);
            this.store.dispatch(
              HistoryApiActions.historyLoadedSuccess({ histories: res })
            );
          });
          this.groupSockets
            .get(group._id)
            ?.on('broadcastMessage', (res: History) => {
              console.log('history: ' + res);
              let currentHistory: History[] = [];
              this.store
                .select(hisotryFeature.selectAll)
                .pipe(first())
                .subscribe((history) => {
                  const updatedHistory = [...history, res];
                  currentHistory = [...history];
                });
              currentHistory.push(res);
              this.store.dispatch(
                HistoryApiActions.historyLoadedSuccess({
                  histories: currentHistory,
                })
              );
            });
        }
      });
    });
  }

  connect() {
    this.socket = io(this.url);
  }

  getChatrooms(groupName: string) {
    return this.store.select(statusFeature.selectGroups).pipe(
      filter((groups) => groups.length != 0),
      map((groups) => {
        return groups.filter((group) => group.name == groupName)[0].rooms;
      })
    );
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

  joinRoom(groupId: string, roomId: string) {
    console.log('Joining room', roomId);
    this.groupSockets.get(groupId)?.emit('joinRoom', roomId);
    this.currentRoomId = roomId;
  }

  send(message: string) {
    this.store
      .select(statusFeature.selectLoggedInUser)
      .pipe(first())
      .subscribe((user) => {
        this.store
          .select(statusFeature.selectActivatedGroup)
          .pipe(first())
          .subscribe((group) => {
            this.groupSockets.get(group!._id.toString())?.emit('newMessage', {
              message: message,
              username: user?.username,
              roomId: this.currentRoomId,
              time: new Date(Date.now()),
            });
          });
      });
  }
}
