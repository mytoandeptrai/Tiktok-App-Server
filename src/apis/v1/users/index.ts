import { Router } from 'express';
import { asyncRouteHandler, forwardMiddleware, loginAuthMiddleware } from '../../../middlewares';
import {
   disableUser,
   enableUser,
   getAllUsers,
   getSuggestedAccounts,
   getUserByUsername,
   getUserInfo,
   searchAllUsers,
   updateAvatar,
   updateUser,
} from './controller';

const router = Router();

router.get('/info/:username', forwardMiddleware, asyncRouteHandler(getUserByUsername));
router.get('/suggested-accounts', asyncRouteHandler(getSuggestedAccounts));
router.patch('/avatar', loginAuthMiddleware, asyncRouteHandler(updateAvatar));
router.patch('/disable', loginAuthMiddleware, asyncRouteHandler(disableUser));
router.patch('/enable', loginAuthMiddleware, asyncRouteHandler(enableUser));
router.patch('/update', loginAuthMiddleware, asyncRouteHandler(updateUser));
router.get('/info', loginAuthMiddleware, asyncRouteHandler(getUserInfo));
router.get('/search', asyncRouteHandler(searchAllUsers));
router.get('/', asyncRouteHandler(getAllUsers));

export default router;
