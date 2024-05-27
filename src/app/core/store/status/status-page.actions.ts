import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const StatusPageActions = createActionGroup({
  source: 'Status Page Actions',
  events: {
    login: props<{ username: string }>(),
    loadGroups: emptyProps(),
  },
});
