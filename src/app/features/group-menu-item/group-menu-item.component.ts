import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Group } from '../../core/data/Group';
import { ChatService } from '../../core/services/chat.service';
import { statusFeature } from '../../core/store/status/status.reducer';

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

  openRoom(roomId: string) {
    this.chatService.openGroup(this.group._id);
    this.chatService.joinRoom(this.group._id, roomId);
  }
}
