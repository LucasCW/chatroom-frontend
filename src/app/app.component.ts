import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MessageBoxComponent } from './features/message-box/message-box.component';
import { MessageDisplayComponent } from './features/message-display/message-display.component';
import { MessageComponent } from './features/message/message.component';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { ChatService } from './core/services/chat.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    AsyncPipe,
    MessageBoxComponent,
    MessageComponent,
    ReactiveFormsModule,
    SidebarComponent,
    MessageDisplayComponent,
  ],
})
export class AppComponent {
  title = 'chatroom_front';

  titleService = inject(Title);

  constructor() {
    setTimeout(() => {
      this.title = 'test title';
      this.titleService.setTitle('test title');
      console.log(this.title);
    }, 3000);

    window.onload = (event) => {
      console.log('on load fired', this.title);
    };
  }

  chatService = inject(ChatService);

  formBuilder = inject(FormBuilder);
  store = inject(Store);

  usernameForm = this.formBuilder.group({
    username: 'Lucas',
  });

  onSetUsername() {}
}
