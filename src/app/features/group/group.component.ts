import { Component, Input, inject } from '@angular/core';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent {
  chatService = inject(ChatService);

  @Input()
  groupName!: string;

  @Input()
  groupId!: string;

  onChangeGroup() {
    this.chatService.openGroup(this.groupId);
  }
}
