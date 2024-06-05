import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { History } from '../../data/History';

export const HistoryApiActions = createActionGroup({
  source: 'History Api Actions',
  events: {
    historyLoadedSuccess: props<{ id: string; histories: History[] }>(),
    historyAddedSuccess: props<{ id: string; history: History }>(),
    displayHistory: props<{ id: string }>(),
    reset: emptyProps(),
  },
});
