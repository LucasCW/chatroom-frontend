import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ChatService } from '../../core/services/chat.service';
import { statusFeature } from '../../core/store/status/status.reducer';
import { StatusApiActions } from '../../core/store/status/status-api.actions';

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
    .select(statusFeature.selectJoinedRoom)
    .pipe(map((roomId) => roomId == this.roomId));

  @Input()
  roomName!: string;

  @Input()
  groupId!: string;

  @Input()
  roomId!: string;

  openRoom() {
    this.store.dispatch(
      StatusApiActions.roomLoadedSuccess({ roomId: this.roomId })
    );
  }
}
