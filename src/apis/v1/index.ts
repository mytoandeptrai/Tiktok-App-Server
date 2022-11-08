import { Router } from 'express';
import authRouter from './auth';
import userRouter from './users';
import categoryRouter from './categories';
import postRouter from './posts';
import followRouter from './follows';
import postReactionRouter from './post_reaction';

const router = Router();
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/posts', postRouter);
router.use('/follows', followRouter);
router.use('/posts-reaction', postReactionRouter);

export default router;
