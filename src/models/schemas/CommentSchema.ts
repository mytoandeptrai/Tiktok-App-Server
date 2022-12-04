import { model, Model, Schema } from 'mongoose';
import { MODELS } from '../../utils/constants';
import IComment from '../interfaces/IComment';

const CommentSchema = new Schema<IComment>(
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
      contents: { type: String, required: true },
      media_url: { type: String },
      comment_reaction_count: { type: Number, default: 0 },
   },
   {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   }
);

CommentSchema.index({ user_id: 1, post_id: 1 });

const CommentModel: Model<IComment> = model<IComment>(
   MODELS.comment,
   CommentSchema,
   MODELS.comment
);

export default CommentModel;
