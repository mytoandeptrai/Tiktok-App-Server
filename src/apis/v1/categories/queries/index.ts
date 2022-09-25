/* eslint-disable prettier/prettier */
import { NextFunction, Request } from 'express';
import { CategoryModel, PostModel } from '../../../../models';
import {
   QUERY_DELETED_IGNORE,
   QUERY_IGNORE,
} from '../../../../utils/constants';
import { ApiFeatures } from '../../../../utils/features';

export const getAllCategories = async (req: Request, next: NextFunction) => {
   try {
      const { CURRENT_PAGE, SIZE } = new ApiFeatures(
         null,
         req.query
      ).getSizeAndCurrentPage();

      const features = new ApiFeatures(
         CategoryModel.find({ ...QUERY_DELETED_IGNORE }).select(QUERY_IGNORE),
         req.query
      ).paginating();

      const count = await CategoryModel.count({ ...QUERY_DELETED_IGNORE });

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

export const getAllPostsOfCategory = async (
   req: Request,
   next: NextFunction
) => {
   const category_id = req.params.id;

   try {
      const { CURRENT_PAGE, SIZE } = new ApiFeatures(
         null,
         req.query
      ).getSizeAndCurrentPage();

      const features = new ApiFeatures(
         PostModel.find({
            category_id: {
               $elemMatch: {
                  id: category_id,
               },
            },
            ...QUERY_DELETED_IGNORE,
         }).populate([
            {
               path: 'category_id.id',
               select: 'category_name',
            },
         ]),
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
