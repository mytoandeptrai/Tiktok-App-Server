import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Express, NextFunction, Response } from 'express';
import expressFileupload from 'express-fileupload';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import routers from './apis';
import configs from './configs';
import { errorMiddleware } from './middlewares/errorMiddleware';
import initializeResources from './resources';
import { redis, redisStore } from './resources/redis';
import requestIp from 'request-ip';

const app: Express = express();

const corsOptions = {
   credentials: true,
   origin: ['http://localhost:3000'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(expressFileupload({ useTempFiles: false }));
app.use(
   express.urlencoded({
      extended: true,
      limit: '100mb',
   })
);

app.set('trust proxy', true);

const initializeSecurity = () => {
   app.use(helmet.frameguard());
   app.use(helmet.hidePoweredBy());
   app.use(helmet.hsts());
   app.use(helmet.ieNoOpen());
   app.use(helmet.noSniff());
   app.use(helmet.xssFilter());
   app.use(morgan('combined'));
   app.use(requestIp.mw());
};

const initializeMiddlewares = () => {
   app.use(express.json());

   // use for computing processing time on response
   app.use((req: any, _res: Response, next: NextFunction) => {
      req.startTime = Date.now();
      next();
   });
};

const initializeErrorHandler = () => {
   app.use(errorMiddleware);
};

initializeSecurity();
initializeMiddlewares();
app.use(routers);
initializeErrorHandler();

const listen = async () => {
   await initializeResources();
   /** configure session middleware */
   app.use(
      session({
         store: new redisStore({ client: redis }),
         secret: configs.sessionSecretKey,
         resave: false,
         saveUninitialized: false,
         cookie: {
            sameSite: true,
            secure: false,
            httpOnly: false,
            maxAge: 1000 * 60 * 10, // 10 minutes
         },
      })
   );

   const PORT = configs.port || 5000;

   app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
   });
};

listen();
