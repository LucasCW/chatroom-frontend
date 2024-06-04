import { Component, Input, inject } from '@angular/core';
import { History } from '../../core/data/History';
import { DatePipe } from '@angular/common';
import { User } from '../../core/data/User';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input()
  history!: History;

  @Input()
  currentUser!: string | null;

  chatService = inject(ChatService);
  onCreatePrivateChannel() {
    if (this.currentUser) {
      this.chatService.createPrivateChannel(
        this.currentUser,
        this.history.user._id
      );
    }
  }
}
