import { Router } from 'express';
import { asyncRouteHandler, loginAuthMiddleware } from '../../../middlewares';
import { createPost } from './controller';

const router = Router();

router.post('/', loginAuthMiddleware, asyncRouteHandler(createPost));

export default router;
