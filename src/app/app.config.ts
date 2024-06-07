import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { hisotryFeature } from './core/store/history/history.reducer';
import { statusFeature } from './core/store/status/status.reducer';
import { userFeature } from './core/store/user/user.reducer';
import { privateChannelFeature } from './core/store/privateChannel/private-channel.reducer';
import * as HistoryEffect from './core/store/history/history.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideState(statusFeature),
    provideState(hisotryFeature),
    provideState(userFeature),
    provideState(privateChannelFeature),
    provideEffects(HistoryEffect),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync(),
  ],
};
