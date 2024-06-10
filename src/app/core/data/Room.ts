import { Group } from './Group';
import { ID } from './ID';
import { User } from './User';

export enum RoomType {
  private = 'PRIVATE',
  public = 'PUBLIC',
}

export interface Room extends ID {
  name: string;
  roomType: RoomType;
  users: User[];
  group: Group;
}
