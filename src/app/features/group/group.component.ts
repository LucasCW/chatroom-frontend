import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { groupFeature } from '../../core/store/group/group.reducer';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent {
  store = inject(Store);
  chatService = inject(ChatService);

  // TODO !!!
  isSelected$ = this.store
    .select(groupFeature.selectJoinedRoomId)
    .pipe(map((group) => true));

  @Input()
  groupName!: string;

  @Input()
  groupId!: string;

  onChangeGroup() {
    // this.chatService.openGroup(this.groupId);
  }
}
