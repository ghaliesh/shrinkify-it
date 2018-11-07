import { IUser } from './user-model';
export interface ILink {
  original: string;
  createdAt: Date;
  shrinked: string;
  user: IUser;
}
