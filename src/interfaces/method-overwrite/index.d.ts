import express from 'express';
import session from 'express-session';

declare global {
   namespace Express {
      interface Request {
         startTime: number;
         user: any;
         files: any;
      }
   }
}

declare module 'express-session' {
   export interface SessionData {
      userId: string;
   }
}
