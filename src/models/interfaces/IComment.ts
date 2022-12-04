import { Document } from 'mongoose';

export default interface IComment extends Document {
   user_id?: string;
   post_id?: string;
   media_url: string;
   contents: string;
   comment_reaction_count: number;
}
