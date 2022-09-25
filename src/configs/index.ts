import 'dotenv/config';

const configs = {
   env: process.env.NODE_ENV,
   port: process.env.PORT,
   apiKey: process.env.API_KEY,
   mongodb: {
      protocol: process.env.MONGODB_PROTOCOL,
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
      host: process.env.MONGODB_HOST,
      replicaSet: process.env.MONGODB_REPLICA_SET,
      dbName: process.env.MONGODB_NAME,
      uri: process.env.MONGODB_URI,
   },
   jwt: {
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
   },
   cloudinary: {
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
   },
   redisPort: process.env.REDIS_PORT || '6379',
   redisHost: process.env.REDIS_HOST || 'localhost',
   redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
   sessionSecretKey: process.env.SESSION_SECRET_KEY || 'mytoandeptrai-secret-key-16-character'
};

export default configs;
