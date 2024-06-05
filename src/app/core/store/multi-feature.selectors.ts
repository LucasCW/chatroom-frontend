import { createSelector } from '@ngrx/store';
import { privateChannelFeature } from './privateChannel/private-channel.reducer';
import { statusFeature } from './status/status.reducer';
import { userFeature } from './user/user.reducer';

// const userFeature = createFeatureSelector<UserState>('user');
// const historyFeature = createFeatureSelector<HistoryState>('history');
// const statusFeature = createFeatureSelector<StatusState>('status');
// const privateChannelFeature =
//   createFeatureSelector<PrivateChannelState>('privateChannel');

// export const selectMessageSending = createSelector(
//   userFeature,
//   historyFeature,
//   statusFeature,
//   (userState, historyState, statusState) => {
//     return { userState, historyState, statusState };
//   }
// );

export const selectMessageSending = createSelector(
  statusFeature.selectActivatedGroup,
  statusFeature.selectJoinedRoom,
  userFeature.selectUserById,
  privateChannelFeature.selectJoinedChannelId,
  (activatedGroup, joinedRoom, user, joinedPrivateChannel) => {
    return { activatedGroup, joinedRoom, user, joinedPrivateChannel };
  }
);