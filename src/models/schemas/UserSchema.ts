import argon2 from 'argon2';
import { Model, model, Schema } from 'mongoose';
import { MODELS } from '../../utils/constants';
import IUser from '../interfaces/IUser';
import bcrypt from 'bcrypt';

const UserSchema = new Schema<IUser>(
   {
      fullname: {
         type: String,
         required: true,
      },
      username: {
         type: String,
         required: true,
      },
      password: {
         type: String,
         required: true,
      },
      avatar: { type: String, default: '' },
      bio: { type: String, default: '' },
      is_enabled: { type: Boolean, default: true },
      is_deleted: { type: Boolean, default: false },
      tick: { type: Boolean, default: false },
      followings_count: { type: Number, default: 0 },
      followers_count: { type: Number, default: 0 },
      likes_count: { type: Number, default: 0 },
      website_url: { type: String, default: '' },
      social_network: [{ name: String, url: String }],
      role: { type: String, default: 'user' },
   },
   {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
   }
);

UserSchema.index({ fullname: 'text', username: 'text' });

UserSchema.pre(
   'save',
   async function (this: IUser, next: (err?: Error | undefined) => void) {
      if (!this.isModified('password')) {
         return next();
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(this.password, salt);
      this.password = hashPassword;

      next();
   }
);
UserSchema.method(
   'isCheckPassword',
   async function (password: string, user: IUser) {
      try {
         return await bcrypt.compare(password, user.password);
      } catch (error) {
         return false;
      }
   }
);

const UserModel: Model<IUser> = model<IUser>(
   MODELS.user,
   UserSchema,
   MODELS.user
);
export default UserModel;
