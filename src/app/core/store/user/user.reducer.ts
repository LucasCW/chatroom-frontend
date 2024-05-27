import { createFeature, createReducer, on } from '@ngrx/store';
import { User } from '../../data/User';
import { UserApiActions } from './user-api.actions';

export interface State {
  loggedInUser: User | null;
}

const initState: State = {
  loggedInUser: null,
};

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initState,
    on(UserApiActions.userLoadedSuccess, (state, action) => {
      console.log('userLoadedSuccess triggered', action.username);
      return { ...state, loggedInUser: { username: action.username } };
    })
  ),
});
