import { ID } from './ID';
import { Room } from './Room';

export interface Group extends ID {
  name: string;
  path: string;
  rooms: Room[];
}
