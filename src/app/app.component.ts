import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ChatService } from './core/services/chat.service';
import { hisotryFeature } from './core/store/history/history.reducer';
import { GroupComponent } from './features/group/group.component';
import { MessageBoxComponent } from './features/message-box/message-box.component';
import { MessageComponent } from './features/message/message.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    GroupComponent,
    AsyncPipe,
    MessageBoxComponent,
    MessageComponent,
    ReactiveFormsModule,
    SidebarComponent,
  ],
})
export class AppComponent implements OnInit {
  chatService = inject(ChatService);
  ngOnInit(): void {
    // this.chatService.findUser('Lucas');
  }
  title = 'chatroom_front';

  formBuilder = inject(FormBuilder);
  store = inject(Store);

  usernameForm = this.formBuilder.group({
    username: 'Lucas',
  });

  onSetUsername() {
    // this.store.dispatch(
    //   StatusApiActions.userLoadedSuccess({
    //     user: this.usernameForm.controls.username.value!,
    //   })
    // );
  }

  history$ = this.store.select(hisotryFeature.selectAll);
}
