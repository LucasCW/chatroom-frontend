import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Group, GroupType } from '../../data/Group';
import { GroupApiActions as GroupApiActions } from './group-api.actions';

export interface State extends EntityState<Group> {
  joinedRoomId: string | null;
  joinedGroupId: string | null;
}

const adapter = createEntityAdapter<Group>({
  selectId: (group: Group) => group._id,
});

const initialState: State = adapter.getInitialState({
  joinedRoomId: null,
  joinedGroupId: null,
});

export const groupFeature = createFeature({
  name: 'group',
  reducer: createReducer(
    initialState,
    on(GroupApiActions.roomLoadedSuccess, (state, action) => {
      const groupId = state.ids.find((id) =>
        state.entities[id]?.rooms.some((room) => room._id == action.roomId)
      ) as string;
      return {
        ...state,
        joinedRoomId: action.roomId,
        joinedGroupId: groupId,
      };
    }),
    on(GroupApiActions.groupsLoadedSuccess, (state, action) => {
      return adapter.setAll(action.groups, state);
    }),
    on(GroupApiActions.privateChannelCreatedSuccess, (state, action) => {
      const group = state.entities[action.room.group._id]!;
      return adapter.updateOne(
        {
          id: action.room.group._id,
          changes: { ...group, rooms: [...group.rooms, action.room] },
        },
        state
      );
    }),
    on(GroupApiActions.privateChannelsLoadedSuccess, (state, action) => {
      const privateGroupId = state.ids.filter((id) => {
        const group = state.entities[id];
        return group?.type && group.type == GroupType.private;
      })[0] as string;

      const privateGroup = {
        ...state.entities[privateGroupId],
        rooms: action.rooms,
      };

      return adapter.updateOne(
        { id: privateGroupId, changes: privateGroup },
        state
      );
    }),
    on(GroupApiActions.reset, (state, _) => {
      const privateGroupId = state.ids.filter((id) => {
        const group = state.entities[id];
        return group?.type && group.type == GroupType.private;
      })[0] as string;

      const privateGroup = { ...state.entities[privateGroupId], rooms: [] };
      return adapter.updateOne(
        { id: privateGroupId, changes: privateGroup },
        {
          ...state,
          joinedGroupId: null,
          joinedRoomId: null,
        }
      );
    })
  ),
  extraSelectors: ({ selectGroupState }) => {
    const selectGroupByType = (type: GroupType) =>
      createSelector(
        adapter.getSelectors(selectGroupState).selectAll,
        (groups) => {
          return groups.filter((group) => group.type == type);
        }
      );
    const existsPrivateChannel = (creatorId: string, userId: string) =>
      createSelector(selectGroupByType(GroupType.private), (groups) => {
        const rooms = groups.flatMap((group) => group.rooms);

        return rooms.find(
          (room) =>
            JSON.stringify(room.users.map((user) => user._id).sort()) ==
            JSON.stringify([creatorId, userId].sort())
        );
      });
    return {
      ...adapter.getSelectors(selectGroupState),
      selectGroupByType,
      existsChannel: existsPrivateChannel,
    };
  },
});
