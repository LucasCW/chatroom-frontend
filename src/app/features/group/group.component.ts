import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ChatService } from '../../core/services/chat.service';
import { statusFeature } from '../../core/store/status/status.reducer';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent {
  store = inject(Store);
  chatService = inject(ChatService);

  isSelected$ = this.store
    .select(statusFeature.selectActivatedGroup)
    .pipe(map((group) => group?._id == this.groupId));

  @Input()
  groupName!: string;

  @Input()
  groupId!: string;

  onChangeGroup() {
    this.chatService.openGroup(this.groupId);
  }
}
