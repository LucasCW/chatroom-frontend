import { Group } from './Group';
import { ID } from './ID';
import { PrivateChannel } from './PrivateChannel';
import { Room } from './Room';
import { User } from './User';

export interface History extends ID {
  message: string;
  username: string;
  user: User;
  group: Group;
  room: Room | PrivateChannel;
  time: Date;
  isRead: boolean;
}
