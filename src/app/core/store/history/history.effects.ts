import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HistoryApiActions } from './history-api.actions';
import { first, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { userFeature } from '../user/user.reducer';

export const historyReceivedEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(HistoryApiActions.historyReceived),
      switchMap(({ id, history }) => {
        return store.select(userFeature.selectLoggedInUser).pipe(
          first(),
          map((user) => {
            return HistoryApiActions.historyAddedSuccess({
              id: id,
              history: history,
              creatorId: user!,
            });
          })
        );
      })
    );
  },
  { functional: true }
);
