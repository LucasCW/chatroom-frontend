import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Group } from '../../core/data/Group';
import { Room } from '../../core/data/Room';
import { ChatService } from '../../core/services/chat.service';
import { GroupApiActions } from '../../core/store/group/group-api.actions';
import { groupFeature } from '../../core/store/group/group.reducer';
import { HistoryApiActions } from '../../core/store/history/history-api.actions';
import { hisotryFeature } from '../../core/store/history/history.reducer';

@Component({
  selector: 'app-private-channel',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './private-channel.component.html',
  styleUrl: './private-channel.component.scss',
})
export class PrivateChannelComponent {
  store = inject(Store);
  chatService = inject(ChatService);

  @Input()
  privateChannel!: Room;

  @Input()
  group!: Group;

  joinedChannelId$ = this.store.select(groupFeature.selectJoinedRoomId);

  unreadMessages$ = this.store.select(hisotryFeature.selectEntities).pipe(
    map((histories) => {
      return histories[this.privateChannel._id]
        ? histories[this.privateChannel._id]!.histories.filter(
            (history) => !history.isRead
          ).length
        : 0;
    })
  );

  getDisplayName(privateChannel: Room) {
    return privateChannel.users.map((user) => user.username).join(', ');
  }

  openPrivateChannel(channelId: string) {
    this.store.dispatch(
      GroupApiActions.roomLoadedSuccess({
        roomId: channelId,
      })
    );
    this.store.dispatch(HistoryApiActions.displayHistory({ id: channelId }));
  }
}
