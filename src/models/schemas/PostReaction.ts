import { model, Model, Schema } from 'mongoose';
import { MODELS } from '../../utils/constants';
import IPostReaction from '../interfaces/IPostReaction';
import { IReactionTypes } from '../interfaces/IReactionTypes';

const PostReactionSchema = new Schema<IPostReaction>(
   {
      user_id: {
         type: Schema.Types.ObjectId,
         required: true,
         ref: MODELS.user,
      },
      post_id: {
         type: Schema.Types.ObjectId,
         required: true,
         ref: MODELS.post,
      },
      type: { type: String, required: true, enum: [...IReactionTypes] },
   },
   {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   }
);

PostReactionSchema.index({ user_id: 1, post_id: 1 });

const PostReactionModel: Model<IPostReaction> = model<IPostReaction>(
   MODELS.post_reaction,
   PostReactionSchema,
   MODELS.post_reaction
);
export default PostReactionModel;
