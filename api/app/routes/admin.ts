import express, { Request, Response } from 'express'
const packageJson = require('../../package.json');
import {
  // checkSchema,
  check,
  validationResult
} from 'express-validator';

import {
  CreatePerfReview,
  FindOnePerfReview,
  FindAllPerfReview
} from '../controllers/perfreview'

import {
  CreateEmployee,
  FetchOneEmployee,
  FetchAllEmployees
} from '../controllers/usercontroller'

import {
  FindOneFeedback,
  FindAllFeedbacks,
} from '../controllers/feedback'

const router = express.Router({
  strict: true
});

router.get('/', (_req: Request, res: Response) => {
  return res.status(200).send({
    success: true,
    message: 'OK',
    data: {
      serverStatus: 'online',
      version: packageJson.version
    }
  });
});

router.get('/me', (_req: Request, res: Response) => {

  return res.status(200).send({
    success: true,
    data: {
      name: 'Chukwuma Nwaugha',
      email: 'c.nwaugha@gmail.com',
      github: 'https://github.com/nwaughachukwuma'
    }
  })
})

/**
 * create routes for employees
 */
router.post('/create-employee', [
  check('name').exists().withMessage('Provide Employee name'),
  check('email').isEmail().withMessage('Provide Performance email'),
  check('phone').isMobilePhone('any')
    .withMessage('Provide employee phone number'),
  check('gender')
    .custom((value, { req }) => ['male', 'female'].includes(value))
    .withMessage('Provide performance gender'),
  check('role')
    .isIn(['admin', 'staff', 'user'])
    .withMessage('Provide performance employee role'),
  check('level')
    .isIn(['junior', 'mid', 'senior', 'admin', 'executive'])
    .withMessage('Provide employee level'),
], CreateEmployee);
router.get('/employees/:id', FetchOneEmployee);
router.get('/employees', FetchAllEmployees);

/**
 * create routes for performance review
 */
router.post('/create-perf-review', [
  check('employeeId').exists().isUUID('4').withMessage('Provide Employee Id'),
  check('month').exists().withMessage('Provide Performance review month'),
  check('year').exists().withMessage('Provide performance review year'),
  check('score').isInt().toInt().withMessage('Provide performance review score'),
  check('remark').exists().withMessage('Provide performance review remark'),
  check('status').optional().isIn(['done', 'not_done']),
], CreatePerfReview);
router.get('/perf-reviews/:id', FindOnePerfReview);
router.get('/perf-reviews', FindAllPerfReview);

/**
 * admin routes for peer feedbacks
 */
router.get('/feedbacks/:id', FindOneFeedback);
router.get('/feedbacks', FindAllFeedbacks);

export default router