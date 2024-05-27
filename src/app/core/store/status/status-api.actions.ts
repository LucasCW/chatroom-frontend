import { createActionGroup, props } from '@ngrx/store';
import { Room } from '../../data/Room';
import { Group } from '../../data/Group';

export const StatusApiActions = createActionGroup({
  source: 'Status Api Actions',
  events: {
    userLoadedSuccess: props<{ username: string }>(),
    roomLoadedSuccess: props<{ room: Room }>(),
    groupLoadedSuccess: props<{ group: Group }>(),
    groupsLoadedSuccess: props<{ groups: Group[] }>(),
  },
});
