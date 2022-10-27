import { connect, connection } from 'mongoose';
import { logger } from '../utils/logger';
import configs from '../configs';

const mongoDBConfig = configs.mongodb;

const mongodbProtocol = mongoDBConfig.protocol || 'mongodb';

const userNamePwd = mongoDBConfig.username
   ? `${mongoDBConfig.username}:${mongoDBConfig.password}@`
   : '';

let mongodbUrl = `${mongodbProtocol}+srv://${userNamePwd}${mongoDBConfig.host}/${mongoDBConfig.dbName}?retryWrites=true&w=majority`;

if (mongoDBConfig.replicaSet) {
   mongodbUrl += `&replicaSet=${mongoDBConfig.replicaSet}`;
}

const options = {
   autoIndex: true,
   autoCreate: true,
};

const connectMongo = async () => {
   try {
      logger.info('Starting connect to MongoDB...');
      await connect(mongodbUrl, options);

      connection.on('connected', function () {
         logger.info('MongoDB::: Successfully connected to MongoDB');
      });

      connection.on('disconnected', function () {
         logger.info(`\nMongoDB::: Disconnected`);
      });

      connection.on('error', (error) => {
         logger.error('MongoDB::: Connection error::::', JSON.stringify(error));
      });

      logger.info('Successfully connected to MongoDB');
   } catch (error) {
      logger.error(`MongoDB::: Error in tryCatch::: ${error}`);
   }
};

export default connectMongo;
