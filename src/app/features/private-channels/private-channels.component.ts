import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { RoomType } from '../../core/data/Room';
import { groupFeature } from '../../core/store/group/group.reducer';
import { PrivateChannelComponent } from '../private-channel/private-channel.component';
import { GroupType } from '../../core/data/Group';

@Component({
  selector: 'app-private-channels',
  standalone: true,
  templateUrl: './private-channels.component.html',
  styleUrl: './private-channels.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, NgClass, PrivateChannelComponent],
})
export class PrivateChannelsComponent {
  store = inject(Store);

  group$ = this.store
    .select(groupFeature.selectGroupByType(GroupType.private))
    .pipe(map((groups) => groups[0]));

  privateChannels$ = this.store
    .select(groupFeature.selectGroupByType(GroupType.private))
    .pipe(map((groups) => groups.flatMap((group) => group.rooms)));
}
