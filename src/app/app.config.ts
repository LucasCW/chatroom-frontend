import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { groupFeature } from './core/store/group/group.reducer';
import * as HistoryEffect from './core/store/history/history.effects';
import { hisotryFeature } from './core/store/history/history.reducer';
import * as UserEffect from './core/store/user/user.effects';
import { userFeature } from './core/store/user/user.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideState(hisotryFeature),
    provideState(userFeature),
    provideState(groupFeature),
    provideEffects(HistoryEffect, UserEffect),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync(),
  ],
};
