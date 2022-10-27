import { Document } from 'mongoose';

import IUser from './IUser';
import ICategory from './ICategory';

export default interface IPost extends Document {
   user_id: IUser;
   contents: string;
   media_url: string;
   category_id: ICategory[];
   reaction_count: number;
   view_count: number;
   comment_count: number;
   is_deleted: boolean;
}
