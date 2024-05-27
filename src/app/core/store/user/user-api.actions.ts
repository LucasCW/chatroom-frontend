import { createActionGroup, props } from '@ngrx/store';

export const UserApiActions = createActionGroup({
  source: 'User Api Actions',
  events: {
    userLoadedSuccess: props<{ username: string }>(),
  },
});
