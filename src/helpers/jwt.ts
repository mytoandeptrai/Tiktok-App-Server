import configs from '../configs';
import { ExpiredToken } from '../constants/index';
import JWT from 'jsonwebtoken';

const signAccessToken = (userID: string, role: string) => {
   return new Promise<any>((resolve, reject) => {
      const payload = { userID, role };

      const secret = configs.jwt.accessTokenSecret;
      const options = {
         expiresIn: ExpiredToken.EXPIRE_IN_ACCESS_TOKEN,
      };

      JWT.sign(payload, secret, options, (err, token) => {
         if (err) reject(err);
         return resolve(token);
      });
   });
};

const signRefreshToken = (userID: string, role: string) => {
   return new Promise<any>((resolve, reject) => {
      const payload = { userID, role };

      const secret = configs.jwt.refreshTokenSecret;
      const options = {
         expiresIn: ExpiredToken.EXPIRE_IN_REFRESH_TOKEN,
      };

      JWT.sign(payload, secret, options, (err, token) => {
         if (err) reject(err);
         return resolve(token);
      });
   });
};

const verifyRefreshToken = (refreshToken: string) => {
   return new Promise((resolve, reject) => {
      const secret = configs.jwt.refreshTokenSecret;
      JWT.verify(refreshToken, secret, (err, payload) => {
         if (err) reject(err);
         return resolve(payload);
      });
   });
};

export { signAccessToken, verifyRefreshToken, signRefreshToken };
