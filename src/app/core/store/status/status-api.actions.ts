import { createActionGroup, props } from '@ngrx/store';
import { Group } from '../../data/Group';

export const StatusApiActions = createActionGroup({
  source: 'Status Api Actions',
  events: {
    userLoadedSuccess: props<{ username: string }>(),
    roomLoadedSuccess: props<{ roomId: string }>(),
    groupLoadedSuccess: props<{ group: Group }>(),
    groupsLoadedSuccess: props<{ groups: Group[] }>(),
  },
});
