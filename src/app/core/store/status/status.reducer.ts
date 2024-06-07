import { createFeature, createReducer, on } from '@ngrx/store';
import { Group } from '../../data/Group';
import { StatusApiActions } from './status-api.actions';

export interface State {
  joinedRoom: string | null;
  activatedGroup: Group | null;
  groups: Group[];
}

const initState: State = {
  // TODO skipping login process
  joinedRoom: null,
  activatedGroup: null,
  groups: [],
};

export const statusFeature = createFeature({
  name: 'status',
  reducer: createReducer(
    initState,
    on(StatusApiActions.roomLoadedSuccess, (state, action) => {
      return { ...state, joinedRoom: action.roomId };
    }),
    on(StatusApiActions.groupLoadedSuccess, (state, action) => {
      return { ...state, activatedGroup: { ...action.group } };
    }),
    on(StatusApiActions.groupsLoadedSuccess, (state, action) => {
      return { ...state, groups: [...action.groups] };
    }),
    on(StatusApiActions.leaveChatroom, (state, action) => {
      return { ...state, activatedGroup: null, joinedRoom: null };
    }),
    on(StatusApiActions.reset, (state, _) => {
      return {
        ...state,
        joinedRoom: null,
        activatedGroup: null,
      };
    })
  ),
});
