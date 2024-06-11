import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, map, switchMap } from 'rxjs';
import { UserApiActions } from './user-api.actions';
import { groupFeature } from '../group/group.reducer';
import { GroupType } from '../../data/Group';
import { HistoryApiActions } from '../history/history-api.actions';

export const logoutSuccessEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(UserApiActions.logoutSuccess),
      switchMap(() => {
        return store
          .select(groupFeature.selectGroupByType(GroupType.private))
          .pipe(
            first(),
            map((privateGroups) => {
              return HistoryApiActions.reset({ group: privateGroups[0] });
            })
          );
      })
    );
  },
  { functional: true }
);
