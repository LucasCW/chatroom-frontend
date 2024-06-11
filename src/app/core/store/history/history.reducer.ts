import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { History } from '../../data/History';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { HistoryApiActions } from './history-api.actions';

export interface State
  extends EntityState<{ id: string; histories: History[] }> {
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
      action.histories.forEach((history) => {
        return { ...history, isRead: true };
      });
      const history = { ...action };
      const histories = history.histories.map((history) => {
        return { ...history, isRead: true };
      });
      return adapter.setOne({ ...history, histories }, { ...state });
    }),
    on(HistoryApiActions.historyAddedSuccess, (state, action) => {
      const updatedHistory = [...state.entities[action.id]!.histories];
      const loadedHistory = state.loadedHistory;
      updatedHistory.push({
        ...action.history,
        isRead:
          action.creatorId == action.history.user._id ||
          action.history.room == loadedHistory,
      });
      return adapter.updateOne(
        {
          id: action.id,
          changes: { id: action.id, histories: updatedHistory },
        },
        state
      );
    }),
    on(HistoryApiActions.displayHistory, (state, action) => {
      const historyDisplayed = state.entities[action.id]?.histories;
      const updatedHistory = historyDisplayed?.map((history) => {
        return { ...history, isRead: true } as History;
      });
      return adapter.updateOne(
        {
          id: action.id,
          changes: { id: action.id, histories: updatedHistory },
        },
        { ...state, loadedHistory: action.id }
      );
    }),
    on(HistoryApiActions.reset, (state, action) => {
      return adapter.removeOne(action.group._id, {
        ...state,
        loadedHistory: null,
      });
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
