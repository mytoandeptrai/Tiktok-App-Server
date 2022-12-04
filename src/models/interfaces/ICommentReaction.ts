import { Document } from 'mongoose';

export default interface ICommentReaction extends Document {
   user_id?: string;
   comment_id?: string;
   type?: string;
}
