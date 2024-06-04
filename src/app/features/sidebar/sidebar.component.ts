import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { filter, first } from 'rxjs';
import { UserApiActions } from '../../core/store/user/user-api.actions';
import { userFeature } from '../../core/store/user/user.reducer';
import { GroupMenuComponent } from '../group-menu/group-menu.component';
import { ChatService } from '../../core/services/chat.service';
import { PrivateChannelsComponent } from '../private-channels/private-channels.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [
    GroupMenuComponent,
    AsyncPipe,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    PrivateChannelsComponent,
  ],
})
export class SidebarComponent {
  store = inject(Store);
  chatService = inject(ChatService);

  user$ = this.store
    .select(userFeature.selectUserById)
    .pipe(filter((user) => user != null));

  users$ = this.store.select(userFeature.selectAll);

  onSelect(event: MatSelectChange) {
    const userId = event.value;
    this.store
      .select(userFeature.selectLoggedInUser)
      .pipe(first())
      .subscribe((user) => {
        if (!!user) {
          this.chatService.logout(userId);
        }
        this.store.dispatch(UserApiActions.loadLoggedInUser({ userId }));
        this.chatService.loadPrivateChannels(userId);
        this.chatService.login(userId);
      });
  }
}
