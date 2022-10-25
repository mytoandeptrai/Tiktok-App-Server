import IORedis, { Redis } from 'ioredis';
import configs from '../configs';
import { logger } from '../utils/logger';
import connectRedis from 'connect-redis';
import session from 'express-session';

const connection = (): Redis => {
   if (!configs.redisHost) {
      return null as any;
   }
   const redisInstance = new IORedis(configs.redisHost, {
      connectTimeout: 10000,
   });

   redisInstance.on('error', (error: any) => {
      logger.error(`Redis error: ${error}`);
   });

   redisInstance.on('connect', () => {
      logger.info('Redis connected');
   });

   return redisInstance;
};

const redis = connection();
const redisStore = connectRedis(session);

/** Notes with redis instance
 * @param EX seconds -- Set the specified expire time, in seconds.
 * @param PX milliseconds -- Set the specified expire time, in milliseconds.
 * @param NX -- Only set the key if it does not already exist.
 * @param XX -- Only set the key if it already exist.
 */

const set = async (key: string, value: any, ttl: number | string) => {
   logger.info(`set cache with key: ${key}`);
   return redis.set(key, value, 'EX', ttl);
};

const setNX = async (key: string, value: any, ttl: number | string) => {
   logger.info(`setNX cache with key: ${key}`);
   return redis.set(key, value, 'EX', ttl, 'NX');
};

const setXX = async (key: string, value: any, ttl: number | string) => {
   logger.info(`setXX cache with key: ${key}`);
   return redis.set(key, value, 'EX', ttl, 'XX');
};

const get = async (key: string) => {
   logger.info(`get cache with key: ${key}`);
   const data = await redis.get(key);
   logger.info(`get redis: ${data}`);
   return data;
};

const getCacheWithMultipleKeys = async (key: string[]) => {
   logger.info(`get cache with key: ${key}`);
   const data = await redis.mget(key);
   logger.info(`get redis: ${data}`);
   return data;
};

const setCacheWithTime = async (
   key: string,
   data: string | number,
   time: number
) => {
   logger.info(
      `set cache with key: ${key} and data: ${data} in time: ${time} seconds`
   );
   return await redis.setex(key, time, data);
};

const setNxCache = async (key: string, data: string | number) => {
   logger.info(`set nx cache with key: ${key} and data: ${data}`);
   return await redis.setnx(key, data);
};

const expireTimeCache = async (key: string, time: number) => {
   logger.info(`expire time for key: ${key} in time: ${time} seconds`);
   return await redis.expire(key, time, 'NX');
};

const clear = async (key: string) => {
   logger.info(`clear cache with key: ${key}`);
   const data = await redis.del(key);
   logger.info(`clear redis: ${data}`);
   return data;
};

export {
   set,
   setNX,
   setXX,
   get,
   clear,
   redis,
   redisStore,
   setCacheWithTime,
   getCacheWithMultipleKeys,
   setNxCache,
   expireTimeCache,
};
