import { Document } from 'mongoose';
import IPost from './IPost';
import IUser from './IUser';

export default interface IPostReaction extends Document {
   user_id: IUser;
   post_id: IPost;
   type: string;
}
