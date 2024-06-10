import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ChatService } from '../../core/services/chat.service';
import { GroupApiActions } from '../../core/store/group/group-api.actions';
import { groupFeature } from '../../core/store/group/group.reducer';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent {
  store = inject(Store);
  chatService = inject(ChatService);

  isSelected$ = this.store
    .select(groupFeature.selectJoinedRoomId)
    .pipe(map((roomId) => roomId == this.roomId));

  @Input()
  roomName!: string;

  @Input()
  groupId!: string;

  @Input()
  roomId!: string;

  openRoom() {
    this.store.dispatch(
      GroupApiActions.roomLoadedSuccess({
        roomId: this.roomId,
        groupId: this.groupId,
      })
    );
  }
}
