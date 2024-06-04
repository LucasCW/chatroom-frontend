import { User } from './User';

export interface PrivateChannel {
  _id: string;
  users: User[];
}
