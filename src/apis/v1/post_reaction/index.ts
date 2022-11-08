import { Router } from 'express';
import { asyncRouteHandler, loginAuthMiddleware } from '../../../middlewares';
import { getAllUserReactPost, postReaction } from './controller';

const router = Router();

router.post('/', loginAuthMiddleware, asyncRouteHandler(postReaction));
router.get('/:id', getAllUserReactPost);

export default router;
