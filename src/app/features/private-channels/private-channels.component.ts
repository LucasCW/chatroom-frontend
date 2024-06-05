import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChatService } from '../../core/services/chat.service';
import { HistoryApiActions } from '../../core/store/history/history-api.actions';
import { PrivateChannelApiActions } from '../../core/store/privateChannel/private-channel-api.actions';
import { privateChannelFeature } from '../../core/store/privateChannel/private-channel.reducer';
import { StatusApiActions } from '../../core/store/status/status-api.actions';

@Component({
  selector: 'app-private-channels',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './private-channels.component.html',
  styleUrl: './private-channels.component.scss',
})
export class PrivateChannelsComponent {
  store = inject(Store);
  chatService = inject(ChatService);

  privateChannels$ = this.store.select(privateChannelFeature.selectAll);

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
