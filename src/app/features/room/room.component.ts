import { Component, Input, inject } from '@angular/core';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent {
  chatService = inject(ChatService);

  @Input()
  roomName!: string;

  @Input()
  groupId!: string;

  @Input()
  roomId!: string;

  openRoom() {
    this.chatService.joinRoom(this.groupId, this.roomId);
  }
}
