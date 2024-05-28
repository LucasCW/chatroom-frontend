import { createActionGroup, props } from '@ngrx/store';
import { Group } from '../../data/Group';
import { User } from '../../data/User';

export const StatusApiActions = createActionGroup({
  source: 'Status Api Actions',
  events: {
    userLoadedSuccess: props<{ user: User }>(),
    roomLoadedSuccess: props<{ roomId: string }>(),
    groupLoadedSuccess: props<{ group: Group }>(),
    groupsLoadedSuccess: props<{ groups: Group[] }>(),
  },
});
