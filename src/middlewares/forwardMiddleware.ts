import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import configs from '../configs';

export const forwardMiddleware = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const authHeader = req.headers['authorization'] || '';
      const bearerToken = authHeader?.split(' ');
      const token = bearerToken[1];

      const verify = JWT.verify(token, configs.jwt.accessTokenSecret);
      req.user = verify;
      next();
   } catch (error: any) {
      next();
   }
};
