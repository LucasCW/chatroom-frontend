import { ID } from './ID';
import { Room } from './Room';

export enum GroupType {
  private = 'PRIVATE',
  public = 'PUBLIC',
}

export interface Group extends ID {
  name: string;
  rooms: Room[];
  type: GroupType;
}
