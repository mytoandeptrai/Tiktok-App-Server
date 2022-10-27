import { NextFunction, Request } from 'express';
import { ObjectId } from 'mongodb';
import {
   PostModel,
   UserModel,
   PostReactionModel,
   FollowModel,
} from '../../../../models';
import {
   QUERY_DELETED_IGNORE,
   QUERY_IGNORE,
   QUERY_LOCKED_IGNORE,
} from '../../../../utils/constants';
import { ApiFeatures } from '../../../../utils/features';
import { clear, setNX, get } from '../../../../resources/redis';
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
         const isReaction = PostReactionModel.findOne({
            post_id,
            user_id: userId,
         });
         const isFollow = FollowModel.findOne({
            follow_id: result?.user_id._id,
            user_id: userId,
         });

         const resolveAll = await Promise.all([isReaction, isFollow]);

         return {
            data: {
               ...result?.toObject(),
               isReaction: resolveAll[0] ? true : false,
               isFollow: resolveAll[1] ? true : false,
            },
            currentPage: CURRENT_PAGE,
            length: SIZE,
            total: result ? 1 : 0,
         };
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

export const getPostTrends = async (req: Request, next: NextFunction) => {
   const userLogin = req?.user;
   try {
      const { CURRENT_PAGE, SIZE } = new ApiFeatures(
         null,
         req.query
      ).getSizeAndCurrentPage();

      // const ipAddress: string = req.clientIp || '';
      // if (CURRENT_PAGE === 0) {
      //    const random = Math.floor(Math.random() * 6);
      //    await Promise.all([clear(ipAddress), setNX(ipAddress, random, 600)]);
      // }

      // const key = await get(ipAddress);
      // console.log('🚀 ~ file: index.ts ~ line 227 ~ getPostTrends ~ key', key);

      // const sortTopic = (key: string | null) => {
      //    switch (key) {
      //       case '0':
      //          return { _id: -1, view_count: -1, reaction_count: -1 };
      //       case '1':
      //          return { _id: -1, view_count: -1, reaction_count: -1 };
      //       case '2':
      //          return { view_count: -1, _id: -1, reaction_count: -1 };
      //       case '3':
      //          return { view_count: -1, reaction_count: -1, _id: -1 };
      //       case '4':
      //          return { reaction_count: -1, view_count: -1, _id: -1 };
      //       case '5':
      //          return { reaction_count: -1, _id: -1, view_count: -1 };
      //       default:
      //          return { _id: -1 };
      //    }
      // };

      // const OKOK = sortTopic(key);

      const features = new ApiFeatures(
         PostModel.find({ ...QUERY_DELETED_IGNORE })
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
            .select(QUERY_IGNORE)
            .sort({ _id: -1, view_count: -1, reaction_count: -1 }),
         req.query
      ).paginating();

      const count = PostModel.count({ ...QUERY_DELETED_IGNORE });
      const Follow = FollowModel.find({ user_id: userLogin?.userID });
      const Reaction = PostReactionModel.find({ user_id: userLogin?.userID });
      const resolveAll = await Promise.all([
         features.query,
         count,
         Follow,
         Reaction,
      ]);

      if (userLogin) {
         const newResult: any[] = [];

         for (let i = 0; i < resolveAll[0]?.length; i++) {
            const resolveItem = resolveAll[0][i];
            const thisIsFollow = resolveAll[2]?.find((item) => {
               return (
                  item.follow_id.toString() ===
                  resolveItem.user_id._id.toString()
               );
            });

            const thisIsReaction = resolveAll[3]?.find((item) => {
               return item.post_id.toString() === resolveItem._id.toString();
            });

            newResult.push({
               ...resolveItem.toObject(),
               isFollow: thisIsFollow ? true : false,
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
