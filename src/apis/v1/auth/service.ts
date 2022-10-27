import { NextFunction, Request } from 'express';
import { HttpException, StatusCode } from '../../../exceptions';
import { UserModel } from '../../../models';

import {
   signAccessToken,
   signRefreshToken,
   verifyRefreshToken,
} from '../../../helpers/jwt';
import { loginValidate, userValidate } from '../../../helpers/validation';
import { RefreshTokenPayload } from '../../../interfaces';
import { getIdBasedOnObjectId } from '../../../utils/rest';

export const register = async (req: Request, next: NextFunction) => {
   const { error } = userValidate(req.body);
   const { username } = req.body;

   try {
      if (error) {
         throw new HttpException(
            'ValidateError',
            StatusCode.BadRequest.status,
            error.details[0].message,
            StatusCode.BadRequest.name
         );
      }

      const isExist = await UserModel.findOne({
         username,
      });

      if (isExist) {
         throw new HttpException(
            'CreateError',
            StatusCode.BadRequest.status,
            'Username is already',
            StatusCode.BadRequest.name
         );
      }

      const user = new UserModel(req.body);

      const result = await user.save();

      const { password, is_deleted, is_enabled, role, ...res } =
         result.toObject();

      return res;
   } catch (error) {
      next(error);
   }
};

export const login = async (req: Request, next: NextFunction) => {
   const { username, password } = req.body;

   try {
      const { error } = loginValidate(req.body);

      if (error) {
         throw new HttpException(
            'ValidateError',
            StatusCode.BadRequest.status,
            error.details[0].message,
            StatusCode.BadRequest.name
         );
      }

      if (!username || !password) {
         return next(
            new HttpException(
               'MissingError',
               StatusCode.BadRequest.status,
               'Missing username or password',
               StatusCode.BadRequest.name
            )
         );
      }

      const lockedUser = await UserModel.findOne({ username });

      if (lockedUser?.is_deleted === true) {
         throw new HttpException(
            'LockedError',
            StatusCode.NotFound.status,
            'Your account has been locked',
            StatusCode.NotFound.name
         );
      }

      if (lockedUser?.is_enabled === false) {
         const accessToken = await signAccessToken(
            lockedUser._id,
            lockedUser.role
         );
         const refreshToken = await signRefreshToken(
            lockedUser._id,
            lockedUser.role
         );
         return {
            tokens: {
               accessToken,
               refreshToken,
            },
            message: 'Your account has been disabled',
            statusCode: 'DISABLED',
         };
      }

      const user = await UserModel.findOne({ username });

      if (!user) {
         throw new HttpException(
            'NotFoundError',
            StatusCode.NotFound.status,
            'User not registered!',
            StatusCode.NotFound.name
         );
      }

      const isValid = await user.schema.methods.isCheckPassword(password, user);
      if (!isValid) {
         throw new HttpException(
            'NotFoundError',
            StatusCode.Unauthorized.status,
            'Incorrect password',
            StatusCode.Unauthorized.name
         );
      }

      const userId = getIdBasedOnObjectId(user._id);

      const accessToken = await signAccessToken(userId, user.role);

      const refreshToken = await signRefreshToken(userId, user.role);

      // req.session.userId = userId;

      return {
         tokens: {
            accessToken,
            refreshToken,
         },
      };
   } catch (error) {
      next(error);
   }
};

export const refreshToken = async (req: Request, next: NextFunction) => {
   const { refreshToken } = req.body;
   try {
      if (!refreshToken) {
         throw new HttpException(
            'NotFoundError',
            StatusCode.NotFound.status,
            'Missing refreshToken',
            StatusCode.NotFound.name
         );
      }

      const payload: RefreshTokenPayload | any = await verifyRefreshToken(
         refreshToken
      );

      const accessToken = await signAccessToken(
         getIdBasedOnObjectId(payload.userID),
         payload.role
      );
      return {
         tokens: {
            accessToken,
            refreshToken,
         },
      };
   } catch (error) {
      next(error);
   }
};
