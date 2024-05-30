import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ChatService } from '../../core/services/chat.service';
import { statusFeature } from '../../core/store/status/status.reducer';
import { Group } from '../../core/data/Group';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-group-menu-item',
  standalone: true,
  imports: [NgClass, AsyncPipe],
  templateUrl: './group-menu-item.component.html',
  styleUrl: './group-menu-item.component.scss',
})
export class GroupMenuItemComponent {
  store = inject(Store);
  chatService = inject(ChatService);

  @Input()
  group!: Group;

  joinedRoom$ = this.store.select(statusFeature.selectJoinedRoom);

  @Input()
  roomName!: string;

  openRoom(roomId: string) {
    this.chatService.joinRoom(this.group._id, roomId);
  }
}
