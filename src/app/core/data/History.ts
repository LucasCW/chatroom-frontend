import { Group } from './Group';
import { Room } from './Room';
import { User } from './User';

export interface History {
  _id: string;
  message: string;
  username: string;
  user: User;
  group: Group;
  room: Room;
  time: Date;
  isRead: boolean;
}
