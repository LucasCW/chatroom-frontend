import { createActionGroup, props } from '@ngrx/store';
import { History } from '../../data/History';

export const HistoryApiActions = createActionGroup({
  source: 'History Api Actions',
  events: {
    historyLoadedSuccess: props<{ histories: History[] }>(),
  },
});
