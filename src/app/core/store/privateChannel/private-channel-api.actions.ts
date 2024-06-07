import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { PrivateChannel } from '../../data/PrivateChannel';

export const PrivateChannelApiActions = createActionGroup({
  source: 'Private Channel Api Actions',
  events: {
    privateChannelLoadedSuccess: props<{ privateChannelId: string }>(),
    privateChannelsLoadedSuccess: props<{
      privateChannels: PrivateChannel[];
    }>(),
    privateChannelCreatedSuccess: props<{ privateChannel: PrivateChannel }>(),
    leavePrivateChannel: emptyProps(),
    reset: emptyProps(),
  },
});
