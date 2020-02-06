require('dotenv').config();
import express from 'express';
import {Request, Response} from 'express'
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');
const { logger } = require('./logger');
import {validateAuthToken} from './middleware'
import { employeeRouter, adminRouter } from './routes';

const app = express();

const port = process.env.PORT || 3000;
app.set('trust proxy', true);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(
  bunyanMiddleware({
    headerName: 'X-Request-Id',
    propertyName: 'reqId',
    logName: 'reqId',
    obscureHeaders: ['authorization'],
    logger,
    additionalRequestFinishData: (_req: Request, _res: Response) => {
      return {};
    }
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// add user auth validation
app.use(validateAuthToken);

// define route paths for employee and admin
app.use('/employee', employeeRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.get('*', (_req: Request, res: Response) => {
  res.status(404).send({ success: false, message: 'Page not found.', data: {} });
});

const server = app.listen(port);

logger.info(`API server started on: ${port}`);

module.exports = { app, server };