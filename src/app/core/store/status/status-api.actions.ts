import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Group } from '../../data/Group';
import { User } from '../../data/User';
import { PrivateChannel } from '../../data/PrivateChannel';

export const StatusApiActions = createActionGroup({
  source: 'Status Api Actions',
  events: {
    roomLoadedSuccess: props<{ roomId: string }>(),
    groupLoadedSuccess: props<{ group: Group }>(),
    openPrivateChannel: emptyProps(),
    groupsLoadedSuccess: props<{ groups: Group[] }>(),
    privateChannelLoadedSuccess: props<{ privateChannels: PrivateChannel[] }>(),
    privateChannelCreatedSuccess: props<{ privateChannel: PrivateChannel }>(),
  },
});
