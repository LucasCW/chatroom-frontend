import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Group } from '../../data/Group';
import { Room } from '../../data/Room';

export const GroupApiActions = createActionGroup({
  source: 'Group Api Actions',
  events: {
    roomLoadedSuccess: props<{ roomId: string }>(),
    groupsLoadedSuccess: props<{ groups: Group[] }>(),
    privateChannelCreatedSuccess: props<{ room: Room }>(),
    privateChannelsLoadedSuccess: props<{ group: Group; rooms: Room[] }>(),
    groupLoadedSuccess: props<{ groupId: string }>(),
    reset: emptyProps(),
  },
});
