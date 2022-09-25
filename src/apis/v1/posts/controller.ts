import { NextFunction, Request, Response } from 'express';

import { ApiResponse, Meta } from '../../../utils/rest';
import * as service from './service';

export const createPost = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<any> => {
   const result = await service.createPost(req, next);
   if (result)
      new ApiResponse(result, 'OK', 200, Date.now() - req.startTime).send(res);
};
