import { createActionGroup, props } from '@ngrx/store';

export const UserPageActions = createActionGroup({
  source: 'User Page Actions',
  events: {
    login: props<{ username: string }>(),
  },
});
