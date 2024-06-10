import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Group } from '../../core/data/Group';
import { Room } from '../../core/data/Room';
import { ChatService } from '../../core/services/chat.service';
import { HistoryApiActions } from '../../core/store/history/history-api.actions';
import { hisotryFeature } from '../../core/store/history/history.reducer';
import { GroupApiActions } from '../../core/store/group/group-api.actions';
import { groupFeature } from '../../core/store/group/group.reducer';

@Component({
  selector: 'app-chatroom',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss',
})
export class ChatroomComponent {
  @Input()
  group!: Group;

  @Input()
  room!: Room;

  store = inject(Store);
  chatService = inject(ChatService);

  joinedRoom$ = this.store.select(groupFeature.selectJoinedRoomId);

  unreadMessages$ = this.store.select(hisotryFeature.selectEntities).pipe(
    map((histories) => {
      return histories[this.room._id]
        ? histories[this.room._id]!.histories.filter(
            (history) => !history.isRead
          ).length
        : 0;
    })
  );

  openRoom(roomId: string) {
    console.log('open room clicked');
    // this.chatService.openGroup(this.group._id);
    this.store.dispatch(
      GroupApiActions.roomLoadedSuccess({
        roomId: roomId,
        groupId: this.group._id,
      })
    );
    this.store.dispatch(HistoryApiActions.displayHistory({ id: roomId }));
  }
}
