import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Group } from '../../data/Group';

export const StatusApiActions = createActionGroup({
  source: 'Status Api Actions',
  events: {
    roomLoadedSuccess: props<{ roomId: string }>(),
    groupLoadedSuccess: props<{ group: Group }>(),
    leaveChatroom: emptyProps(),
    groupsLoadedSuccess: props<{ groups: Group[] }>(),
    reset: emptyProps(),
  },
});
