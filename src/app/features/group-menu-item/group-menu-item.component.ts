import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Group } from '../../core/data/Group';
import { ChatService } from '../../core/services/chat.service';
import { groupFeature } from '../../core/store/group/group.reducer';
import { ChatroomComponent } from '../chatroom/chatroom.component';

@Component({
  selector: 'app-group-menu-item',
  standalone: true,
  templateUrl: './group-menu-item.component.html',
  styleUrl: './group-menu-item.component.scss',
  imports: [NgClass, AsyncPipe, ChatroomComponent],
})
export class GroupMenuItemComponent {
  store = inject(Store);
  chatService = inject(ChatService);

  @Input()
  group!: Group;

  joinedRoom$ = this.store.select(groupFeature.selectJoinedGroupId);
}
