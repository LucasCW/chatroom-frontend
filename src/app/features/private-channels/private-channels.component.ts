import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { privateChannelFeature } from '../../core/store/privateChannel/private-channel.reducer';
import { PrivateChannelComponent } from '../private-channel/private-channel.component';

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

  privateChannels$ = this.store.select(privateChannelFeature.selectAll);
}
