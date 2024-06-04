import { createFeature, createReducer, on } from '@ngrx/store';
import { Group } from '../../data/Group';
import { PrivateChannel } from '../../data/PrivateChannel';
import { StatusApiActions } from './status-api.actions';

export interface State {
  joinedRoom: string | null;
  activatedGroup: Group | null;
  groups: Group[];
  privateChannels: PrivateChannel[];
}

const initState: State = {
  // TODO skipping login process
  joinedRoom: null,
  activatedGroup: null,
  groups: [],
  privateChannels: [],
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
    on(StatusApiActions.privateChannelLoadedSuccess, (state, action) => {
      return { ...state, privateChannels: action.privateChannels };
    }),
    on(StatusApiActions.openPrivateChannel, (state, action) => {
      return { ...state, activatedGroup: null };
    }),
    on(StatusApiActions.privateChannelCreatedSuccess, (state, action) => {
      const privateChannels = [...state.privateChannels];
      privateChannels.push(action.privateChannel);
      return { ...state, privateChannels };
    })
  ),
});
