require('dotenv').config();
import express from 'express';
import { Request, Response } from 'express'
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');
const { logger } = require('./logger');
import { validateAuthToken, escapeRoute } from './middleware'
import { employeeRouter, adminRouter } from './routes';
import { DBModel } from './models'
import { hashPassword } from './utils/helpers'

const app = express();

const port = process.env.PORT || 3000;
app.set('trust proxy', true);
app.use(helmet());


const whitelistUrls = [
  'http://localhost:8081',
  'http://localhost:3001', 
  'http://localhost:3002'
];

const corsOptions = {
  origin: function(origin: string, callback: Function) {
    if (whitelistUrls.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
// var corsOptions = {
//   origin: "http://localhost:8081",
//   employee: "http://localhost:3001",
//   admin: "http://localhost:3002",
// };
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)) // enable pre-flight request for DELETE request

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
DBModel.sequelize.sync({ force: process.env.__DEV__ ? false : false })
  .then(() => {
    console.log("Drop and re-sync db.");
    DBModel.employees.create({
      name: 'Super Admin',
      email: 'super@admin.com',
      password: hashPassword('supersecret'),
      role: 'superadmin',
      rank: 'senior'
    })
  });

// add user auth validation with array of routes 
// to escape from validation check
app.use(escapeRoute([
  '/api/employee/login', 
  '/api/admin/register',
  '/api/admin/login'
], validateAuthToken));

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