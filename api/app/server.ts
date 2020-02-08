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
import {DBModel} from './models'

const app = express();

const port = process.env.PORT || 3000;
app.set('trust proxy', true);
app.use(helmet());

var corsOptions = {
  origin: "http://localhost:8081",
  employee: "http://localhost:3001",
  admin: "http://localhost:3002",
};
app.use(cors(corsOptions));

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

// sync database connection
DBModel.sequelize.sync({ force: process.env.__DEV__ ? true: false })
  .then(() => {
    console.log("Drop and re-sync db.");
  });
// add user auth validation
app.use(validateAuthToken);

// define route paths for employee and admin
app.use('/api/employee', employeeRouter);
app.use('/api/admin', adminRouter);

// catch 404 and forward to error handler
app.get('*', (_req: Request, res: Response) => {
  res.status(404).send({ success: false, message: 'Page not found.', data: {} });
});

const server = app.listen(port);

logger.info(`API server started on: ${port}`);

module.exports = { app, server };