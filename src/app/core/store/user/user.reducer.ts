import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { User } from '../../data/User';
import { UserApiActions } from './user-api.actions';

interface State extends EntityState<User> {
  loggedInUser: string | null;
}

const adapter = createEntityAdapter<User>({
  selectId: (user: User) => user._id,
});

const initialState: State = adapter.getInitialState({ loggedInUser: null });

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialState,
    on(UserApiActions.usersLoadedSuccess, (state, action) => {
      return adapter.setAll(action.users, { ...state });
    }),
    on(UserApiActions.loadLoggedInUser, (state, action) => {
      return { ...state, loggedInUser: action.userId };
    }),
    on(UserApiActions.logoutSuccess, (state, _) => {
      return { ...state, loggedInUser: null };
    })
  ),
  extraSelectors: ({
    selectUserState,
    selectEntities,
    selectLoggedInUser,
  }) => ({
    ...adapter.getSelectors(selectUserState),
    selectUserById: createSelector(
      selectEntities,
      selectLoggedInUser,
      (entities, loggedInUserId) => {
        return entities[loggedInUserId!];
      }
    ),
  }),
});
