import { Group } from './Group';
import { ID } from './ID';
import * as CustomTypes from './Custom-types';
import { User } from './User';

export interface History extends ID {
  message: string;
  username: string;
  user: User;
  group: Group;
  room: CustomTypes.ID;
  time: Date;
  isRead: boolean;
}
