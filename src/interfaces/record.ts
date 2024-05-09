import { IPost } from './post';
import { IUser } from './user';

export interface IRecord extends IUser {
   posts: IPost[];
}
