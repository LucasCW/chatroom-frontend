import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ChatService } from '../../core/services/chat.service';
import { statusFeature } from '../../core/store/status/status.reducer';
import { Group } from '../../core/data/Group';

@Component({
  selector: 'app-group-menu-item',
  standalone: true,
  imports: [],
  templateUrl: './group-menu-item.component.html',
  styleUrl: './group-menu-item.component.scss',
})
export class GroupMenuItemComponent {
  store = inject(Store);
  chatService = inject(ChatService);

  @Input()
  group!: Group;

  @Input()
  groupName!: string;

  @Input()
  groupId!: string;

  onChangeGroup() {
    this.chatService.openGroup(this.groupId);
  }

  isSelected$ = this.store
    .select(statusFeature.selectJoinedRoom)
    .pipe(map((roomId) => roomId == this.roomId));

  @Input()
  roomName!: string;

  @Input()
  roomId!: string;

  openRoom(roomId: string) {
    this.chatService.joinRoom(this.group._id, roomId);
    debugger;
  }
}
