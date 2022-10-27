import { Request, NextFunction } from 'express';
import { UserModel } from '../../../models';
import { HttpException, StatusCode } from '../../../exceptions';
import { CloudinaryUpload } from '../../../utils/uploads/cloudinaryUpload';
import { QUERY_IGNORE } from '../../../utils/constants';
import { updateUsersValidate } from '../../../helpers/validation';
import { MongooseCustom } from '../../../libs';

export const updateAvatar = async (req: Request, next: NextFunction) => {
   const avatar = req.files?.avatar;
   const user = req.user;
   const userID = user.userID;

   try {
      if (!req.files) {
         throw new HttpException(
            'MissingError',
            StatusCode.BadRequest.status,
            'Missing files',
            StatusCode.BadRequest.name
         );
      }

      const cloudinary = new CloudinaryUpload();

      if (Array.isArray(avatar)) {
         throw new HttpException(
            'TypeError',
            StatusCode.BadRequest.status,
            'Array is not allowed',
            StatusCode.BadRequest.name
         );
      }

      const data = await cloudinary.uploads(avatar, 'image');
      if (data?.error === 'type error') {
         throw new HttpException(
            'TypeError',
            StatusCode.BadRequest.status,
            'Video is not allowed',
            StatusCode.BadRequest.name
         );
      }

      const updateDoc = {
         $set: {
            avatar: data ? data.url : undefined,
         },
      };

      await UserModel.findOneAndUpdate({ _id: userID }, updateDoc).select(
         QUERY_IGNORE
      );

      return data && data?.url;
   } catch (error) {
      next(error);
   }
};

export const updateUser = async (req: Request, next: NextFunction) => {
   const { error } = updateUsersValidate(req.body);
   const { fullname, username, avatar, bio, website_url, social_network } =
      req.body;
   const user = req.user;
   const userID = user.userID;

   try {
      if (error) {
         throw new HttpException(
            'ValidateError',
            StatusCode.BadRequest.status,
            error.details[0].message,
            StatusCode.BadRequest.name
         );
      }

      const isExist = await UserModel.findOne({ username });

      const userIdFound = isExist?._id.toString();

      if (isExist && userIdFound !== userID) {
         return next(
            new HttpException(
               'CreateError',
               StatusCode.BadRequest.status,
               'Username is already',
               StatusCode.BadRequest.name
            )
         );
      }

      const updateDoc = {
         $set: {
            fullname,
            username,
            avatar,
            bio,
            website_url,
            social_network,
         },
      };

      const result = await UserModel.findOneAndUpdate(
         { _id: userID },
         updateDoc
      ).select(QUERY_IGNORE);

      return result;
   } catch (error) {
      next(error);
   }
};

export const disableUser = async (req: Request, next: NextFunction) => {
   const user = req.user;
   const userID = user.userID;
   try {
      const mongooseCustom = new MongooseCustom(UserModel);

      const result = await mongooseCustom.findOneAndDisable(userID);
      return result;
   } catch (error) {
      next(error);
   }
};

export const enableUser = async (req: Request, next: NextFunction) => {
   const user = req.user;
   const userID = user.userID;

   try {
      const mongooseCustom = new MongooseCustom(UserModel);
      const result = await mongooseCustom.findOneAndEnable(userID);
      return result;
   } catch (error) {
      next(error);
   }
};

export const softDeleteUser = async (req: Request, next: NextFunction) => {
   const user = req.user;
   const userID = user.userID;

   try {
      const mongooseCustom = new MongooseCustom(UserModel);
      const result = await mongooseCustom.findOneAndSoftDelete(userID);
      return result;
   } catch (error) {
      next(error);
   }
};

export const restoreUser = async (req: Request, next: NextFunction) => {
   const user = req.user;
   const userID = user.userID;

   try {
      const mongooseCustom = new MongooseCustom(UserModel);
      const result = await mongooseCustom.findOneAndRestore(userID);
      return result;
   } catch (error) {
      next(error);
   }
};
