import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { statusFeature } from '../../core/store/status/status.reducer';
import { AsyncPipe } from '@angular/common';
import { ChatService } from '../../core/services/chat.service';
import { StatusApiActions } from '../../core/store/status/status-api.actions';
import { HistoryApiActions } from '../../core/store/history/history-api.actions';

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

  privateChannels$ = this.store.select(statusFeature.selectPrivateChannels);

  openPrivateChannel(channelId: string) {
    this.store.dispatch(StatusApiActions.openPrivateChannel());
    this.store.dispatch(
      StatusApiActions.roomLoadedSuccess({ roomId: channelId })
    );
    this.store.dispatch(HistoryApiActions.displayHistory({ id: channelId }));
  }
}
