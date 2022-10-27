import { Router } from 'express';
import { asyncRouteHandler, loginAuthMiddleware } from '../../../middlewares';
import { follow, getFollower, getFollowing } from './controller';

const router = Router();

router.post('/', loginAuthMiddleware, asyncRouteHandler(follow));
router.get(
   '/followers/:id',
   loginAuthMiddleware,
   asyncRouteHandler(getFollower)
);
router.get(
   '/followings/:id',
   loginAuthMiddleware,
   asyncRouteHandler(getFollowing)
);

export default router;
