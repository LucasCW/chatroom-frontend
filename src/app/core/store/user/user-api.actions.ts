import { createActionGroup, props } from '@ngrx/store';
import { User } from '../../data/User';

export const UserApiActions = createActionGroup({
  source: 'User Api Actions',
  events: {
    usersLoadedSuccess: props<{ users: User[] }>(),
    loadLoggedInUser: props<{ userId: string }>(),
  },
});
