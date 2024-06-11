import { createSelector } from '@ngrx/store';
import { groupFeature } from './group/group.reducer';
import { hisotryFeature } from './history/history.reducer';
import { userFeature } from './user/user.reducer';

export const selectMessageSending = createSelector(
  groupFeature.selectJoinedGroupId,
  groupFeature.selectJoinedRoomId,
  userFeature.selectUserById,
  (activatedGroup, joinedRoom, user) => {
    return { activatedGroup, joinedRoom, user };
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
