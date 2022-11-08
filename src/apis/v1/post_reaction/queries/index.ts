import { NextFunction, Request } from 'express';
import { PostReactionModel } from '../../../../models';
import {
   QUERY_DELETED_IGNORE,
   QUERY_IGNORE,
} from '../../../../utils/constants';
import { ApiFeatures } from '../../../../utils/features';

export const getAllUsersReactPost = async (
   req: Request,
   next: NextFunction
) => {
   const post_id = req.params.id;
   const { CURRENT_PAGE, SIZE } = new ApiFeatures(
      null,
      req.query
   ).getSizeAndCurrentPage();
   try {
      const features = new ApiFeatures(
         PostReactionModel.find({ post_id, ...QUERY_DELETED_IGNORE })
            .populate([
               {
                  path: 'post_id',
                  select: 'contents media_url reaction_count view_count',
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
