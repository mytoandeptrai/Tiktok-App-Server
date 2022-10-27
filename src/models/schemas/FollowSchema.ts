import { model, Model, Schema } from 'mongoose';
import { MODELS } from '../../utils/constants';
import IFollow from '../interfaces/IFollow';
const FollowSchema = new Schema(
   {
      follow_id: {
         type: Schema.Types.ObjectId,
         required: true,
         ref: MODELS.user,
      }, // As A
      user_id: {
         type: Schema.Types.ObjectId,
         required: true,
         ref: MODELS.user,
      }, // As B => B is following A
   },
   {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   }
);

FollowSchema.index({ follow_id: 1, user_id: 1 });

const FollowModel: Model<IFollow> = model<IFollow>(
   MODELS.follow,
   FollowSchema,
   MODELS.follow
);
export default FollowModel;
