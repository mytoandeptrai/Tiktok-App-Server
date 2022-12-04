import { Router } from 'express';
import {
   asyncRouteHandler,
   forwardMiddleware,
   loginAuthMiddleware,
} from '../../../middlewares';
import {
   createPost,
   forceDeletePost,
   getAllPosts,
   getAllPostsOfUser,
   getPost,
   getPostTrends,
   restorePost,
   softDeletePost,
   updatePost,
   viewPost,
} from './controller';

const router = Router();

router.get('/for-you', forwardMiddleware, asyncRouteHandler(getPostTrends));
router.get(
   '/user/:id',
   forwardMiddleware,
   asyncRouteHandler(getAllPostsOfUser)
);
router.get('/:id', forwardMiddleware, asyncRouteHandler(getPost));
router.patch('/restore', loginAuthMiddleware, asyncRouteHandler(restorePost));
router.patch(
   '/soft-delete',
   loginAuthMiddleware,
   asyncRouteHandler(softDeletePost)
);
router.post('/', loginAuthMiddleware, asyncRouteHandler(createPost));
router.patch('/', loginAuthMiddleware, asyncRouteHandler(updatePost));
router.delete('/', loginAuthMiddleware, asyncRouteHandler(forceDeletePost));
router.get('/', asyncRouteHandler(getAllPosts));
router.post('/view/:id', asyncRouteHandler(viewPost));

export default router;
