import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import {
   QUERY_DELETED_IGNORE,
   QUERY_IGNORE,
   QUERY_LOCKED_IGNORE,
} from '../../../../utils/constants';
import { CategoryModel, PostModel, UserModel } from '../../../../models';
import { ApiFeatures } from '../../../../utils/features';

export const getAllPosts = async (req: Request, next: NextFunction) => {
   try {
      const { CURRENT_PAGE, SIZE } = new ApiFeatures(
         null,
         req.query
      ).getSizeAndCurrentPage();

      const features = new ApiFeatures(
         PostModel.find({ ...QUERY_LOCKED_IGNORE })
            .populate([
               {
                  path: 'user_id',
                  select: 'fullname username avatar tick',
               },
               {
                  path: 'category_id.id',
                  select: 'category_name',
               },
            ])
            .select(QUERY_IGNORE),
         req.query
      );

      const count = PostModel.count({ ...QUERY_DELETED_IGNORE });

      const resolveAll = await Promise.all([features.query, count]);

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

export const getAllPostsOfUser = async (req: Request, next: NextFunction) => {
   const user_id = req.params.id;
   const userLogin = req?.user;
   try {
      const { CURRENT_PAGE, SIZE } = new ApiFeatures(
         null,
         req.query
      ).getSizeAndCurrentPage();

      if (userLogin) {
         const ObjectUserId: any = new ObjectId(user_id);

         const result = PostModel.aggregate([
            {
               $match: { user_id: ObjectUserId },
            },
            {
               $lookup: {
                  from: 'post_reaction',
                  localField: '_id',
                  foreignField: 'post_id',
                  as: 'isReaction',
               },
            },
            {
               $project: {
                  _id: 1,
                  contents: 1,
                  media_url: 1,
                  reaction_count: 1,
                  view_count: 1,
                  category_id: 1,
                  created_at: 1,
                  updated_at: 1,
                  comment_count: 1,
                  isReaction: {
                     $filter: {
                        input: '$isReaction',
                        cond: {
                           $eq: ['$$this.user_id', ObjectUserId],
                        },
                     },
                  },
               },
            },
            { $sort: { _id: -1 } },
         ]);
         const user = UserModel.findOne({ _id: user_id }).select(QUERY_IGNORE);
         const count = PostModel.count({ user_id, ...QUERY_DELETED_IGNORE });

         const resolveAll = await Promise.all([result, count, user]);

         return {
            data: {
               user: resolveAll[2],
               post: resolveAll[0],
            },
            currentPage: CURRENT_PAGE,
            length: SIZE,
            total: resolveAll[1],
         };
      }

      const features = new ApiFeatures(
         PostModel.find({ user_id, ...QUERY_DELETED_IGNORE })
            .populate([
               {
                  path: 'category_id.id',
                  select: 'category_name',
               },
            ])
            .select(QUERY_IGNORE + ' -user_id')
            .sort({ _id: -1 }),
         req.query
      );

      const user = UserModel.findOne({ _id: user_id }).select(QUERY_IGNORE);
      const count = PostModel.count({ user_id, ...QUERY_DELETED_IGNORE });

      const resolveAll = await Promise.all([features.query, count, user]);

      return {
         data: {
            user: resolveAll[2],
            post: resolveAll[0],
         },
         currentPage: CURRENT_PAGE,
         length: SIZE,
         total: resolveAll[1],
      };
   } catch (error) {
      next(error);
   }
};

export const getPost = async (req: Request, next: NextFunction) => {
   const post_id = req.params.id;
   const userLogin = req?.user;
   try {
      const { CURRENT_PAGE, SIZE } = new ApiFeatures(
         null,
         req.query
      ).getSizeAndCurrentPage();

      const features = new ApiFeatures(
         PostModel.findOne({ _id: post_id, ...QUERY_DELETED_IGNORE })
            .populate([
               {
                  path: 'user_id',
                  select: 'fullname username avatar tick',
               },
               {
                  path: 'category_id.id',
                  select: 'category_name',
               },
            ])
            .select(QUERY_IGNORE),
         req.query
      );

      const result = await features.query;

      if (userLogin) {
         const userId = userLogin.userID;
         /**
          * TODO
          * GET REACTION AND FOLLOW USERS NOT INTEGRATE YET
          */
      }

      return {
         data: result,
         currentPage: CURRENT_PAGE,
         length: SIZE,
         total: result ? 1 : 0,
      };
   } catch (error) {
      next(error);
   }
};
