import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { ChatService } from './core/services/chat.service';
import { GroupComponent } from './features/group/group.component';
import { RoomComponent } from './features/room/room.component';
import { MessageBoxComponent } from './features/message-box/message-box.component';
import { MessageComponent } from './features/message/message.component';

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
  ],
})
export class AppComponent implements OnInit {
  title = 'chatroom_front';

  chatService = inject(ChatService);

  groupNames$ = this.chatService.groups.pipe(
    map((groups) => groups.flatMap((group) => group.name))
  );

  groups$ = this.chatService.groups;

  activeGroup$ = this.chatService.currentGroup$;

  history$ = this.chatService.history$;

  rooms$ = this.chatService.currentGroup$.pipe(
    filter((group) => group != null),
    switchMap((group) => {
      return this.chatService.getChatrooms(group!.name);
    })
  );

  ngOnInit(): void {}
}
