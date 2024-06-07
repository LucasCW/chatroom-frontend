import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { PrivateChannel } from '../../data/PrivateChannel';
import { PrivateChannelApiActions } from './private-channel-api.actions';

export interface State extends EntityState<PrivateChannel> {
  joinedChannelId: string | null;
}

const adapter = createEntityAdapter<PrivateChannel>({
  selectId: (privateChannel: PrivateChannel) => privateChannel._id,
});

const initialState: State = adapter.getInitialState({
  joinedChannelId: null,
});

export const privateChannelFeature = createFeature({
  name: 'privateChannel',
  reducer: createReducer(
    initialState,
    on(
      PrivateChannelApiActions.privateChannelLoadedSuccess,
      (state, action) => {
        return { ...state, joinedChannelId: action.privateChannelId };
      }
    ),
    on(
      PrivateChannelApiActions.privateChannelsLoadedSuccess,
      (state, action) => {
        return adapter.setAll(action.privateChannels, state);
      }
    ),
    on(
      PrivateChannelApiActions.privateChannelCreatedSuccess,
      (state, action) => {
        return adapter.addOne(action.privateChannel, state);
      }
    ),
    on(PrivateChannelApiActions.reset, (state, _) => {
      return adapter.removeAll({ ...state, joinedChannel: null });
    }),
    on(PrivateChannelApiActions.joinedChatroom, (state, _) => {
      return { ...state, joinedChannelId: null };
    })
  ),
  extraSelectors: ({ selectPrivateChannelState }) => ({
    ...adapter.getSelectors(selectPrivateChannelState),
  }),
});
