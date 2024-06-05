import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { History } from '../../data/History';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { HistoryApiActions } from './history-api.actions';

interface State extends EntityState<{ id: string; histories: History[] }> {
  loadedHistory: string | null;
}

const adapter = createEntityAdapter<{ id: string; histories: History[] }>({
  selectId: (record: { id: string; histories: History[] }) => record.id,
});

const initialState: State = adapter.getInitialState({
  loadedHistory: null,
});

export const hisotryFeature = createFeature({
  name: 'history',
  reducer: createReducer(
    initialState,
    on(HistoryApiActions.historyLoadedSuccess, (state, action) => {
      console.log(action);
      return adapter.setOne(action, { ...state });
    }),
    on(HistoryApiActions.historyAddedSuccess, (state, action) => {
      const updatedHistory = [...state.entities[action.id]!.histories];
      updatedHistory.push(action.history);
      return adapter.updateOne(
        {
          id: action.id,
          changes: { id: action.id, histories: updatedHistory },
        },
        state
      );
    }),
    on(HistoryApiActions.displayHistory, (state, action) => {
      return { ...state, loadedHistory: action.id };
    }),
    on(HistoryApiActions.reset, (state, _) => {
      return adapter.removeAll({ ...state, loadedHistory: null });
    })
  ),
  extraSelectors: ({
    selectHistoryState,
    selectEntities,
    selectLoadedHistory,
  }) => ({
    ...adapter.getSelectors(selectHistoryState),
    selectByDisplayedId: createSelector(
      selectEntities,
      selectLoadedHistory,
      (entities, loadedId) => {
        if (loadedId) {
          return !!entities[loadedId] ? entities[loadedId]?.histories : [];
        }
        return [];
      }
    ),
  }),
});
