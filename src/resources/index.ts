import configs from '../configs';
import { logger } from '../utils/logger';
import { connect } from './cloudinary';
import connectMongo from './mongo';
import { redis } from './redis';

const initializeResources = async () => {
   if (configs.mongodb.uri) {
      await connectMongo();
   }

   if (
      configs.cloudinary.api_key &&
      configs.cloudinary.api_secret &&
      configs.cloudinary.cloud_name
   ) {
      connect;

      logger.info(
         `Successfully connected to Cloudinary: ${connect.cloud_name}`
      );
   }

   if (configs.redisPort) {
      logger.info(`Redis is connecting with status ${redis.status}`);
   }
};

export default initializeResources;
