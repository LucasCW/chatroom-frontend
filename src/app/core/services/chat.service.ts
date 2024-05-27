import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, filter, first, map } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { Group } from '../data/Group';
import { History } from '../data/History';
import { Store } from '@ngrx/store';
import { userFeature } from '../store/user/user.reducer';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = '192.168.1.33:3000';
  socket!: Socket;

  store = inject(Store);

  groups = new BehaviorSubject<Group[]>([]);
  groupSockets = new Map<string, Socket>();

  currentGroup$ = new BehaviorSubject<Group | null>(null);

  currentGroupId!: string;
  currentRoomId!: string;

  history$ = new BehaviorSubject<History[]>([]);

  constructor() {
    this.connect();
    this.socket.on('groupsList', ({ groups }: { groups: Group[] }) => {
      this.currentGroup$.next(groups[0]);
      this.currentGroupId = groups[0]._id;
      this.groups.next(groups);

      groups.forEach((group) => {
        if (!this.groupSockets.has(group._id)) {
          this.groupSockets.set(group._id, io(this.url + '/' + group._id));
          this.groupSockets.get(group._id)?.on('message', (res) => {
            console.log('message: ' + res);
          });
          this.groupSockets.get(group._id)?.on('history', (res: History[]) => {
            console.log('history: ' + res);
            this.history$.next(res);
          });
          this.groupSockets
            .get(group._id)
            ?.on('broadcastMessage', (res: History) => {
              console.log('history: ' + res);
              let currentHistory: History[] = [];
              this.history$.pipe(first()).subscribe((history) => {
                const updatedHistory = [...history, res];
                currentHistory = [...history];
              });
              currentHistory.push(res);
              this.history$.next(currentHistory);
            });
        }
      });
    });
  }

  connect() {
    this.socket = io(this.url);
  }

  getChatrooms(groupName: string) {
    return this.groups.pipe(
      filter((groups) => groups.length != 0),
      map((groups) => {
        return groups.filter((group) => group.name == groupName)[0].rooms;
      })
    );
  }

  openGroup(groupId: string) {
    this.groups
      .pipe(
        first(),
        map((groups) => {
          const group = groups.filter((group) => group._id == groupId)[0];
          this.currentGroup$.next(group);
          this.currentGroupId = group._id;
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
      .select(userFeature.selectLoggedInUser)
      .pipe(first())
      .subscribe((user) => {
        this.groupSockets.get(this.currentGroupId)?.emit('newMessage', {
          message: message,
          username: user?.username,
          roomId: this.currentRoomId,
          time: new Date(Date.now()),
        });
      });
  }
}
