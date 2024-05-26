import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Group } from '../data/Group';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  url = 'http://localhost:3000';
  socket!: Socket;
  groupSockets = new Map<string, Socket>();

  constructor() {
    this.connect();
    this.socket.on('groupsList', ({ groups }: { groups: Group[] }) => {
      console.log('test groupsList');
      console.log('groups: ', groups);
      groups.forEach((group) => {
        if (!this.groupSockets.has(group._id)) {
          this.groupSockets.set(group._id, io(this.url + '/' + group.path));
          this.groupSockets.get(group._id)?.on('message', (res) => {
            console.log('message: ' + res + ' from ', group.name);
          });
        }
      });
    });
  }

  connect() {
    this.socket = io(this.url);
  }
}
