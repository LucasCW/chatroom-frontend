import { ID } from './ID';
import { User } from './User';

export interface PrivateChannel extends ID {
  users: User[];
}
