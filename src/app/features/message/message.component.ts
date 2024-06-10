import { DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { History } from '../../core/data/History';
import { ChatService } from '../../core/services/chat.service';
import { Store } from '@ngrx/store';
import { groupFeature } from '../../core/store/group/group.reducer';
import { first } from 'rxjs';
import { GroupApiActions } from '../../core/store/group/group-api.actions';
import { group } from '@angular/animations';

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
        groupFeature.existsChannel(this.currentUser, this.history.user._id)
      )
      .pipe(first())
      .subscribe((privateChannel) => {
        !!privateChannel
          ? (() => {
              this.store.dispatch(
                GroupApiActions.roomLoadedSuccess({
                  roomId: privateChannel._id,
                  groupId: privateChannel.group._id,
                })
              );
            })()
          : this.chatService.createPrivateChannel(
              this.currentUser!,
              this.history.user._id
            );
      });
  }
}
