import { Router } from 'express';
import authRouter from './auth';
import userRouter from './users';
import categoryRouter from './categories';
import postRouter from './posts';
import followRouter from './follows';

const router = Router();
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/posts', postRouter);
router.use('/follows', followRouter);

export default router;
