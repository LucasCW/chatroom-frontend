import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { hisotryFeature } from './core/store/history/history.reducer';
import { StatusApiActions } from './core/store/status/status-api.actions';
import { statusFeature } from './core/store/status/status.reducer';
import { GroupComponent } from './features/group/group.component';
import { MessageBoxComponent } from './features/message-box/message-box.component';
import { MessageComponent } from './features/message/message.component';
import { RoomComponent } from './features/room/room.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    GroupComponent,
    AsyncPipe,
    RoomComponent,
    MessageBoxComponent,
    MessageComponent,
    ReactiveFormsModule,
  ],
})
export class AppComponent implements OnInit {
  title = 'chatroom_front';

  formBuilder = inject(FormBuilder);
  store = inject(Store);

  usernameForm = this.formBuilder.group({
    username: 'Lucas',
  });

  onSetUsername() {
    this.store.dispatch(
      StatusApiActions.userLoadedSuccess({
        username: this.usernameForm.controls.username.value!,
      })
    );
  }

  groups$ = this.store.select(statusFeature.selectGroups);

  activeGroup$ = this.store.select(statusFeature.selectActivatedGroup);

  history$ = this.store.select(hisotryFeature.selectAll);

  rooms$ = this.store.select(statusFeature.selectActivatedGroup).pipe(
    filter((group) => group != null),
    map((group) => {
      return group!.rooms;
    })
  );

  ngOnInit(): void {}
}
