import { createSelector } from '@ngrx/store';
import { groupFeature } from './group/group.reducer';
import { userFeature } from './user/user.reducer';
import { hisotryFeature } from './history/history.reducer';
import { GroupType } from '../data/Group';

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
  groupFeature.selectEntities,
  groupFeature.selectJoinedGroupId,
  groupFeature.selectJoinedRoomId,
  userFeature.selectUserById,
  (entities, activatedGroup, joinedRoom, user) => {
    const isPrivateMessage =
      entities[activatedGroup!]?.type == GroupType.private;
    return { activatedGroup, joinedRoom, user, isPrivateMessage };
  }
);

export const selectHistoryById = (id: string) =>
  createSelector(
    hisotryFeature.selectEntities,
    groupFeature.selectJoinedRoomId,
    (histories, joinedRoomId) => {
      return histories[joinedRoomId!];
    }
  );
