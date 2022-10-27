import { NextFunction, Request, Response } from 'express';
import { HttpException, StatusCode } from '../exceptions';

export const adminAuthMiddleware = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      if (req.user.role === 'admin') {
         next();
      } else {
         throw new HttpException(
            'AuthorizationError',
            StatusCode.Unauthorized.status,
            'You are not admin',
            StatusCode.Unauthorized.name
         );
      }
   } catch (error: any) {
      next({
         name: error.name,
         message: error.message,
         status: StatusCode.Unauthorized.status,
      });
   }
};
