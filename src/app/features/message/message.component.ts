import { DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { History } from '../../core/data/History';
import { ChatService } from '../../core/services/chat.service';
import { Store } from '@ngrx/store';
import { privateChannelFeature } from '../../core/store/privateChannel/private-channel.reducer';
import { first } from 'rxjs';
import { PrivateChannelApiActions } from '../../core/store/privateChannel/private-channel-api.actions';
import { StatusApiActions } from '../../core/store/status/status-api.actions';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  store = inject(Store);

  @Input()
  history!: History;

  @Input()
  currentUser!: string | null;

  chatService = inject(ChatService);

  onCreatePrivateChannel() {
    if (!this.currentUser) return;

    if (this.currentUser == this.history.user._id) return;

    this.store
      .select(
        privateChannelFeature.existsChannel(
          this.currentUser,
          this.history.user._id
        )
      )
      .pipe(first())
      .subscribe((privateChannel) => {
        debugger;
        !!privateChannel
          ? (() => {
              this.store.dispatch(
                PrivateChannelApiActions.privateChannelLoadedSuccess({
                  privateChannelId: privateChannel._id,
                })
              );
              this.store.dispatch(StatusApiActions.leaveChatroom());
            })()
          : this.chatService.createPrivateChannel(
              this.currentUser!,
              this.history.user._id
            );
      });
  }
}
