import { createFeature, createReducer, on } from '@ngrx/store';
import { User } from '../../data/User';
import { StatusApiActions } from './status-api.actions';
import { Room } from '../../data/Room';
import { Group } from '../../data/Group';

export interface State {
  loggedInUser: User | null;
  joinedRoom: Room | null;
  activatedGroup: Group | null;
  groups: Group[];
}

const initState: State = {
  loggedInUser: null,
  joinedRoom: null,
  activatedGroup: null,
  groups: [],
};

export const statusFeature = createFeature({
  name: 'status',
  reducer: createReducer(
    initState,
    on(StatusApiActions.userLoadedSuccess, (state, action) => {
      return { ...state, loggedInUser: { username: action.username } };
    }),
    on(StatusApiActions.roomLoadedSuccess, (state, action) => {
      return { ...state, joinedRoom: { ...action.room } };
    }),
    on(StatusApiActions.groupLoadedSuccess, (state, action) => {
      return { ...state, activatedGroup: { ...action.group } };
    }),
    on(StatusApiActions.groupsLoadedSuccess, (state, action) => {
      return { ...state, groups: [...action.groups] };
    })
  ),
});
