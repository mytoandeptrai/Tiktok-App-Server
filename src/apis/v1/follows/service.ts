import { NextFunction, Request } from 'express';
import { ObjectId } from 'mongodb';
import { HttpException, StatusCode } from '../../../exceptions';
import { followValidate } from '../../../helpers/validation';
import { FollowModel, UserModel } from '../../../models';

export const followUser = async (req: Request, next: NextFunction) => {
   const user = req.user;
   const userID = user.userID;
   const reqBody = {
      ...req.body,
      user_id: userID,
   };

   const { follow_id } = req.body;
   const { error } = followValidate(reqBody);

   try {
      if (error) {
         throw new HttpException(
            'ValidateError',
            StatusCode.BadRequest.status,
            error.details[0].message,
            StatusCode.BadRequest.name
         );
      }

      if (follow_id === userID) {
         throw new HttpException(
            'SpamError',
            StatusCode.BadRequest.status,
            'Can not follow yourself',
            StatusCode.BadRequest.name
         );
      }

      const followedUser = await UserModel.findOne({ _id: follow_id });

      if (!followedUser) {
         throw new HttpException(
            'NotFoundError',
            StatusCode.BadRequest.status,
            'User is not exists',
            StatusCode.BadRequest.name
         );
      }

      const isExistedFollow = await FollowModel.findOne({
         follow_id,
         user_id: userID,
      });
      if (isExistedFollow) {
         const deletedId = new ObjectId(isExistedFollow?._id);
         const result = FollowModel.findByIdAndDelete({ _id: deletedId });
         const updateDocFollower = { $inc: { followers_count: -1 } };
         const updateDocFollowing = { $inc: { followings_count: -1 } };

         const resolveAll = await Promise.all([
            result,
            UserModel.findByIdAndUpdate({ _id: userID }, updateDocFollowing),
            UserModel.findByIdAndUpdate({ _id: follow_id }, updateDocFollower),
         ]);

         return { ...resolveAll[0]?.toObject(), unfollow: true };
      }

      const result = FollowModel.create(reqBody);
      const updateDocFollower = { $inc: { followers_count: 1 } };
      const updateDocFollowing = { $inc: { followings_count: 1 } };
      const resolveAll = await Promise.all([
         result,
         UserModel.findByIdAndUpdate({ _id: userID }, updateDocFollowing),
         UserModel.findByIdAndUpdate({ _id: follow_id }, updateDocFollower),
      ]);

      return resolveAll[0];
   } catch (error) {
      next(error);
   }
};
