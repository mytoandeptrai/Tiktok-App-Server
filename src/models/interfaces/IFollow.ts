import { Document } from 'mongoose';
import IUser from './IUser';

export default interface IFollow extends Document {
   follow_id: IUser;
   user_id: IUser;
}
