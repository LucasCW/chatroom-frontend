import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { hisotryFeature } from '../../core/store/history/history.reducer';
import { statusFeature } from '../../core/store/status/status.reducer';
import { MessageBoxComponent } from '../message-box/message-box.component';
import { MessageComponent } from '../message/message.component';
import { userFeature } from '../../core/store/user/user.reducer';
import { first, map } from 'rxjs';
import { History } from '../../core/data/History';

@Component({
  selector: 'app-message-display',
  standalone: true,
  templateUrl: './message-display.component.html',
  styleUrl: './message-display.component.scss',
  imports: [MessageComponent, MessageBoxComponent, AsyncPipe, NgClass],
})
export class MessageDisplayComponent {
  store = inject(Store);

  room$ = this.store.select(statusFeature.selectJoinedRoom);

  history$ = this.store.select(hisotryFeature.selectAll);

  isLoggedInUser(history: History) {
    return this.store.select(userFeature.selectLoggedInUser).pipe(
      first(),
      map((userId) => {
        if (userId == history.user._id) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
