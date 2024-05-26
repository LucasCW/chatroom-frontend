import { Room } from './Room';

export interface Group {
  _id: string;
  name: string;
  path: string;
  rooms: Room[];
}
