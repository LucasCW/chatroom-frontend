import { Group } from './Group';
import { Room } from './Room';

export interface History {
  _id: string;
  message: string;
  username: string;
  group: Group;
  room: Room;
  time: Date;
}
