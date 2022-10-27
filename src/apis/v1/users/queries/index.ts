import { NextFunction, Request } from 'express';
import { ExpiredTime, RedisKeys } from '../../../../constants';
import { FollowModel, UserModel } from '../../../../models';
import {
   getCacheWithMultipleKeys,
   setCacheWithTime,
} from '../../../../resources/redis';
import { convertSomethingToString, parseStringFromJSON } from '../../../../utils/common';
import {
   QUERY_DELETED_IGNORE,
   QUERY_IGNORE,
   QUERY_LOCKED_IGNORE,
} from '../../../../utils/constants/index';
import { ApiFeatures } from '../../../../utils/features';
import { HttpException, StatusCode } from './../../../../exceptions';

export const getAllUsers = async (req: Request, next: NextFunction) => {
   try {
      const { CURRENT_PAGE, SIZE } = new ApiFeatures(
         null,
         req.query
      ).getSizeAndCurrentPage();

      const cacheResults = await getCacheWithMultipleKeys([
         RedisKeys.GET_ALL_USERS,
         RedisKeys.COUNT_GET_ALL_USERS,
         RedisKeys.CURRENT_PAGE_GET_ALL_USERS,
      ]);

      if (
         cacheResults[0] !== null &&
         cacheResults[1] !== null &&
         cacheResults[2] !== null &&
         Number(cacheResults[2]) === CURRENT_PAGE
      ) {
         return {
            data: parseStringFromJSON(cacheResults[0]),
            currentPage: cacheResults[2],
            length: SIZE,
            total: cacheResults[1],
         };
      } else {
         const features = new ApiFeatures(
            UserModel.find({ ...QUERY_LOCKED_IGNORE }).select(QUERY_IGNORE),
            req.query
         ).paginating();

         const result = await features.query;

         const count = await UserModel.count({ ...QUERY_LOCKED_IGNORE });

         await setCacheWithTime(
            RedisKeys.GET_ALL_USERS,
            convertSomethingToString(result),
            ExpiredTime.ONE_DAY
         );

         await setCacheWithTime(
            RedisKeys.COUNT_GET_ALL_USERS,
            count,
            ExpiredTime.ONE_DAY
         );

         await setCacheWithTime(
            RedisKeys.CURRENT_PAGE_GET_ALL_USERS,
            CURRENT_PAGE,
            ExpiredTime.ONE_DAY
         );

         return {
            data: result,
            currentPage: CURRENT_PAGE,
            length: SIZE,
            total: count,
         };
      }
   } catch (error) {
      next(error);
   }
};

export const searchAllUsers = async (req: Request, next: NextFunction) => {
   const { q, type } = req.query;
   try {
      const { CURRENT_PAGE, SIZE } = new ApiFeatures(
         null,
         req.query
      ).getSizeAndCurrentPage();

      const count = await UserModel.count({
         $text: {
            $search: String(q),
         },
         ...QUERY_LOCKED_IGNORE,
      });

      if (type === 'less') {
         const result = await UserModel.find({
            $text: {
               $search: String(q),
            },
            ...QUERY_LOCKED_IGNORE,
         })
            .select(QUERY_IGNORE)
            .limit(5);

         return {
            data: result,
            currentPage: CURRENT_PAGE,
            length: SIZE,
            total: count,
         };
      }

      const features = new ApiFeatures(
         UserModel.find({
            $text: {
               $search: String(q),
            },
            ...QUERY_LOCKED_IGNORE,
         }).select(QUERY_IGNORE),
         req.query
      ).paginating();

      const result = await features.query;

      return {
         data: result,
         currentPage: CURRENT_PAGE,
         length: SIZE,
         total: count,
      };
   } catch (error) {
      next(error);
   }
};

export const getUserInfo = async (req: Request, next: NextFunction) => {
   try {
      const _id = req.user.userID;
      const result = await UserModel.findOne({
         _id: _id,
         ...QUERY_LOCKED_IGNORE,
      }).select(QUERY_IGNORE);

      if (!result) {
         throw new HttpException(
            'ForbiddenError',
            StatusCode.BadRequest.status,
            'Your account has been locked',
            'Locked',
            Date.now() - req.startTime
         );
      }

      return result;
   } catch (error) {
      next(error);
   }
};

export const getUserByUsername = async (req: Request, next: NextFunction) => {
   try {
      const { username } = req.params;
      const user = req.user;

      const result = await UserModel.findOne({
         username,
         ...QUERY_LOCKED_IGNORE,
      }).select(QUERY_IGNORE);

      if (!result) {
         throw new HttpException(
            'NotFound',
            StatusCode.BadRequest.status,
            'NotFound',
            'NotFound',
            Date.now() - req.startTime
         );
      }

      if (user) {
         const user_id = req.user.userID;
         const checkFollow = await FollowModel.find({
            user_id,
            ...QUERY_DELETED_IGNORE,
         })
            .populate([
               {
                  path: 'follow_id',
                  select: 'fullname username avatar tick',
               },
               {
                  path: 'user_id',
                  select: 'fullname username avatar tick',
               },
            ])
            .select(QUERY_IGNORE);

         const isFollowed = checkFollow.find((element) => {
            return element?.follow_id?.username === username;
         });

         if (isFollowed) {
            const newResult = { ...result.toObject(), isFollow: true };
            return newResult;
         }
      }

      return { ...result.toObject(), isFollow: false };
   } catch (error) {
      next(error);
   }
};

export const getSuggestedAccounts = async (
   req: Request,
   next: NextFunction
) => {
   try {
      const { CURRENT_PAGE, SIZE } = new ApiFeatures(
         null,
         req.query
      ).getSizeAndCurrentPage();

      const cacheResults = await getCacheWithMultipleKeys([
         RedisKeys.GET_SUGGESTED_USERS,
         RedisKeys.COUNT_GET_SUGGESTED_USERS,
         RedisKeys.CURRENT_PAGE_GET_SUGGESTED_USERS,
      ]);

      if (
         cacheResults[0] !== null &&
         cacheResults[1] !== null &&
         cacheResults[2] !== null &&
         Number(cacheResults[2]) === CURRENT_PAGE
      ) {
         return {
            data: parseStringFromJSON(cacheResults[0]),
            currentPage: cacheResults[2],
            length: SIZE,
            total: cacheResults[1],
         };
      } else {
         const features = new ApiFeatures(
            UserModel.find({ ...QUERY_LOCKED_IGNORE })
               .sort({ followers_count: -1, likes_count: -1 })
               .select(QUERY_IGNORE),
            req.query
         ).paginating();

         const result = await features.query;

         const count = await UserModel.count({ ...QUERY_LOCKED_IGNORE });

         await setCacheWithTime(
            RedisKeys.GET_SUGGESTED_USERS,
            convertSomethingToString(result),
            ExpiredTime.ONE_DAY
         );

         await setCacheWithTime(
            RedisKeys.COUNT_GET_SUGGESTED_USERS,
            count,
            ExpiredTime.ONE_DAY
         );

         await setCacheWithTime(
            RedisKeys.CURRENT_PAGE_GET_SUGGESTED_USERS,
            CURRENT_PAGE,
            ExpiredTime.ONE_DAY
         );

         return {
            data: result,
            currentPage: CURRENT_PAGE,
            length: SIZE,
            total: count,
         };
      }
   } catch (error) {
      next(error);
   }
};
