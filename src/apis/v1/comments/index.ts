import { Router } from 'express';
import {
   asyncRouteHandler,
   forwardMiddleware,
   loginAuthMiddleware,
} from '../../../middlewares';
import {
   createComment,
   forceDeleteComment,
   getAllCommentsOfPost,
   updateComment,
} from './controller';

const router = Router();

router
   .route('/:id')
   .get(forwardMiddleware, getAllCommentsOfPost)
   .patch(loginAuthMiddleware, asyncRouteHandler(updateComment))
   .delete(loginAuthMiddleware, asyncRouteHandler(forceDeleteComment));
router.post('/', loginAuthMiddleware, asyncRouteHandler(createComment));

export default router;
