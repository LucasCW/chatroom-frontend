import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { History } from '../../data/History';
import { createFeature, createReducer, on } from '@ngrx/store';
import { HistoryApiActions } from './history-api.actions';

interface State extends EntityState<History> {}

const adapter = createEntityAdapter<History>({
  selectId: (history: History) => history._id,
});

const initialState: State = adapter.getInitialState();

export const hisotryFeature = createFeature({
  name: 'history',
  reducer: createReducer(
    initialState,
    on(HistoryApiActions.historyLoadedSuccess, (state, action) => {
      return adapter.setAll(action.histories, { ...state });
    })
  ),
  extraSelectors: ({ selectHistoryState }) => ({
    ...adapter.getSelectors(selectHistoryState),
  }),
});
