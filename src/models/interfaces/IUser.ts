import { Document } from 'mongoose';
import { ISocialNetwork } from './ISocialNetwork';

export default class IUser extends Document {
   avatar?: string;
   bio?: string;
   fullname?: string;
   username?: string;
   password: string;
   is_enabled?: boolean;
   is_deleted?: boolean;
   tick?: boolean;
   followings_count?: number;
   followers_count?: number;
   likes_count?: number;
   website_url?: number;
   social_network?: ISocialNetwork[];
   role: string;
}
