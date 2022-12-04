import { model, Model, Schema } from 'mongoose';
import { MODELS } from '../../utils/constants';
import ICommentReaction from '../interfaces/ICommentReaction';
import { IReactionTypes } from '../interfaces/IReactionTypes';

const CommentReactionSchema = new Schema<ICommentReaction>(
   {
      user_id: {
         type: Schema.Types.ObjectId,
         required: true,
         ref: MODELS.user,
      },
      comment_id: {
         type: Schema.Types.ObjectId,
         required: true,
         ref: MODELS.comment,
      },
      type: { type: String, required: true, enum: [...IReactionTypes] },
   },
   {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   }
);

CommentReactionSchema.index({ user_id: 1, comment_id: 1 });

const CommentReactionModel: Model<ICommentReaction> = model<ICommentReaction>(
   MODELS.comment_reaction,
   CommentReactionSchema,
   MODELS.comment_reaction
);

export default CommentReactionModel;
