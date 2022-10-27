import { Router } from 'express';
import {
   adminAuthMiddleware,
   asyncRouteHandler,
   loginAuthMiddleware,
} from '../../../middlewares';
import {
   createCategory,
   forceDeleteCategory,
   getAllCategories,
   getAllPostsOfCategory,
   updateCategory,
} from './controller';

const router = Router();

router.post(
   '/',
   loginAuthMiddleware,
   adminAuthMiddleware,
   asyncRouteHandler(createCategory)
);
router.patch(
   '/',
   loginAuthMiddleware,
   adminAuthMiddleware,
   asyncRouteHandler(updateCategory)
);
router.delete(
   '/',
   loginAuthMiddleware,
   adminAuthMiddleware,
   asyncRouteHandler(forceDeleteCategory)
);
router.get('/', asyncRouteHandler(getAllCategories));
router.get('/:id', asyncRouteHandler(getAllPostsOfCategory));

export default router;
