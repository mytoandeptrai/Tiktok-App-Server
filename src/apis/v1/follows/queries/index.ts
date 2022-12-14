import { NextFunction, Request } from 'express';
import { FollowModel } from '../../../../models';
import {
   QUERY_DELETED_IGNORE,
   QUERY_IGNORE,
} from '../../../../utils/constants';
import { ApiFeatures } from '../../../../utils/features';

export const getFollowingUsers = async (req: Request, next: NextFunction) => {
   const user_id = req.params.id;
   const { CURRENT_PAGE, SIZE } = new ApiFeatures(
      null,
      req.query
   ).getSizeAndCurrentPage();
   try {
      const features = new ApiFeatures(
         FollowModel.find({ user_id, ...QUERY_DELETED_IGNORE })
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
            .select(QUERY_IGNORE),
         req.query
      ).paginating();

      const result = await features.query;

      return {
         data: result,
         currentPage: CURRENT_PAGE,
         length: SIZE,
         total: result.length,
      };
   } catch (error) {
      next(error);
   }
};

export const getFollowers = async (req: Request, next: NextFunction) => {
   const user_id = req.params.id;
   const { CURRENT_PAGE, SIZE } = new ApiFeatures(
      null,
      req.query
   ).getSizeAndCurrentPage();
   try {
      const features = new ApiFeatures(
         FollowModel.find({ follow_id: user_id, ...QUERY_DELETED_IGNORE })
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
            .select(QUERY_IGNORE),
         req.query
      ).paginating();

      const result = await features.query;

      return {
         data: result,
         currentPage: CURRENT_PAGE,
         length: SIZE,
         total: result.length,
      };
   } catch (error) {
      next(error);
   }
};
