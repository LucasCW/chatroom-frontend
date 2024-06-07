import { Component, Input, inject } from '@angular/core';
import { PrivateChannel } from '../../core/data/PrivateChannel';
import { ChatService } from '../../core/services/chat.service';
import { HistoryApiActions } from '../../core/store/history/history-api.actions';
import { PrivateChannelApiActions } from '../../core/store/privateChannel/private-channel-api.actions';
import { privateChannelFeature } from '../../core/store/privateChannel/private-channel.reducer';
import { StatusApiActions } from '../../core/store/status/status-api.actions';
import { AsyncPipe, NgClass } from '@angular/common';
import { Store } from '@ngrx/store';
import { hisotryFeature } from '../../core/store/history/history.reducer';
import { map } from 'rxjs';

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
  privateChannel!: PrivateChannel;

  joinedChannelId$ = this.store.select(
    privateChannelFeature.selectJoinedChannelId
  );

  unreadMessages$ = this.store.select(hisotryFeature.selectEntities).pipe(
    map((histories) => {
      console.log('unreadMessage updated');
      return histories[this.privateChannel._id]?.histories.filter(
        (history) => !history.isRead
      ).length;
    })
  );

  getDisplayName(privateChannel: PrivateChannel) {
    return privateChannel.users.map((user) => user.username).join(', ');
  }

  openPrivateChannel(channelId: string) {
    this.store.dispatch(StatusApiActions.openPrivateChannel());
    this.store.dispatch(
      PrivateChannelApiActions.privateChannelLoadedSuccess({
        privateChannelId: channelId,
      })
    );
    this.store.dispatch(HistoryApiActions.displayHistory({ id: channelId }));
  }
}
