import express, { Request, Response } from 'express'
const packageJson = require('../../package.json');
import {check} from 'express-validator';

import {
  CreatePerformanceReview,
  FindOnePerformanceReview,
  FindAllPerformanceReviews
} from '../controllers/perfreview'

import {
  CreateEmployee,
  FetchOneEmployee,
  FetchAllEmployees
} from '../controllers/employee'

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
  check('rank')
    .optional()
    .isIn(['junior', 'mid', 'senior', 'executive'])
    .withMessage('Provide employee rank'),
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
  check('is_reviewd').optional(),
], CreatePerformanceReview);
router.get('/perf-reviews/:id', FindOnePerformanceReview);
router.get('/perf-reviews', FindAllPerformanceReviews);

/**
 * admin routes for peer feedbacks
 */
router.get('/feedbacks/:id', FindOneFeedback);
router.get('/feedbacks', FindAllFeedbacks);

export default router