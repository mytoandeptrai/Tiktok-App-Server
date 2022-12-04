import { NextFunction, Request } from 'express';
import { CommentModel, CommentReactionModel } from '../../../../models';
import {
   QUERY_DELETED_IGNORE,
   QUERY_IGNORE,
} from '../../../../utils/constants';
import { ApiFeatures } from '../../../../utils/features';
import { view } from '../../posts/service';
import { HttpException, StatusCode } from './../../../../exceptions';
import { ObjectId } from 'mongodb';

export const getAllCommentsOfPost = async (
   req: Request,
   next: NextFunction
) => {
   const post_id = req.params.id;
   const { CURRENT_PAGE, SIZE } = new ApiFeatures(
      null,
      req.query
   ).getSizeAndCurrentPage();
   const ipAddress: string = req.clientIp || '';
   const userLogin = req?.user;

   try {
      const isView = await view(post_id, ipAddress);
      if (!isView) {
         throw new HttpException(
            'NotFoundError',
            StatusCode.BadRequest.status,
            'Post does not exist',
            StatusCode.BadRequest.name
         );
      }

      const features = new ApiFeatures(
         CommentModel.find({
            post_id,
            ...QUERY_DELETED_IGNORE,
         })
            .populate([
               {
                  path: 'user_id',
                  select: 'fullname username avatar tick',
               },
            ])
            .sort({ _id: -1 }),
         req.query
      );

      const count = CommentModel.count({ ...QUERY_DELETED_IGNORE, post_id });
      const reaction = CommentReactionModel.find({
         user_id: userLogin?.userID,
         post_id,
      });

      const resolveAll = await Promise.all([features.query, count, reaction]);

      if (userLogin) {
         const newResult: any[] = [];
         for (let i = 0; i < resolveAll[0].length; i++) {
            const comment = resolveAll[0][i];
            const thisIsReaction = resolveAll[2].find((item) => {
               const commentReactionId = new ObjectId(item?.comment_id);
               const commentId = new ObjectId(comment._id);
               return commentReactionId === commentId;
            });

            newResult.push({
               ...resolveAll[0][i].toObject(),
               isReaction: thisIsReaction ? true : false,
            });
         }

         return {
            data: newResult,
            currentPage: CURRENT_PAGE,
            length: SIZE,
            total: resolveAll[1],
         };
      }

      return {
         data: resolveAll[0],
         currentPage: CURRENT_PAGE,
         length: SIZE,
         total: resolveAll[1],
      };
   } catch (error) {
      next(error);
   }
};
