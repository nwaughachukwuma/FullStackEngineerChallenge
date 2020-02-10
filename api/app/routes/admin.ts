import express, { Request, Response } from 'express'
const packageJson = require('../../package.json');
import {check} from 'express-validator';

import {
  CreatePerformanceReview,
  FindOnePerformanceReview,
  FindAllPerformanceReviews,
  CreateReviewer,
  UpdatePerformanceReview
} from '../controllers/perfReview'

import {
  CreateEmployee,
  FetchOneEmployee,
  FetchAllEmployees,
  UpdateEmployee,
  DeleteEmployee
} from '../controllers/employee'

import {
  // FindOneReviewer,
  FindAllAssignedReviews,
  FindAllAssignedPendingReviews,
} from '../controllers/reviewer'

import { 
  Register,
  Login,
  Logout
} from '../controllers/authController';

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
  check('email').isEmail().withMessage('Provide Employee email'),
  check('phone').isMobilePhone('any')
    .withMessage('Provide employee phone number'),
  check('gender')
    .custom((value, { req }) => ['male', 'female'].includes(value))
    .withMessage('Provide Employee gender'),
  check('role')
    .isIn(['admin', 'staff', 'user'])
    .withMessage('Provide Employee employee role'),
  check('rank')
    .optional()
    .isIn(['junior', 'mid', 'senior', 'executive'])
    .withMessage('Provide employee rank'),
], CreateEmployee);
router.get('/employees/:id', FetchOneEmployee);
router.get('/employees', FetchAllEmployees);
router.put('/employees/:id', UpdateEmployee);
// router.options('/employees/:id');
router.delete('/employees/:id', DeleteEmployee)

/**
 * create routes for performance review
 */
router.post('/create-perf-review', [
  check('employeeId').exists().isUUID('4').withMessage('Provide Employee Id'),
  check('month').exists().withMessage('Provide Performance review month'),
  check('year').exists().withMessage('Provide performance review year'),
  check('evaluation').isInt().toInt().withMessage('Provide performance review evaluation'),
  check('remark').exists().withMessage('Provide performance review remark'),
  check('isReviewd').optional(),
], CreatePerformanceReview);
router.get('/perf-reviews/:id', FindOnePerformanceReview);
router.get('/perf-reviews', FindAllPerformanceReviews);
router.put('/perf-reviews/:id', UpdatePerformanceReview);

/**
 * admin routes for employee performance review feedbacks
 */
router.post('/create-reviewer', [
  check('performanceReviewId').exists({ checkNull: true }).isUUID('4')
    .withMessage('Provide performance review Id'),
  check('peerId').exists({ checkNull: true })
    .withMessage('Provide the Id of the employee giving the feedback'),
  check('feedback').not().exists()
    .withMessage('Feedback should be provided by the reviewer'),
], CreateReviewer);
router.get('/reviewers', FindAllAssignedReviews);
router.get('/pending-reviews', FindAllAssignedPendingReviews);


/**
 * auth routes for admin users
 */

router.post('/register', [
  check('name').exists().withMessage('Provide Employee name'),
  check('email').isEmail().withMessage('Provide Employee email'),
  check('password').exists().withMessage('Provide Employee password'),
  check('confirmPassword', 'Provide Confirm password')
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Confirm password must match password'),
  check('phone').optional().isMobilePhone('any')
    .withMessage('Provide employee phone number'),
  check('gender')
    .optional()
    .isIn(['male', 'female'])
    .withMessage('Provide Employee gender'),
], Register);

router.post('/login', [
  check('email').isEmail().withMessage('Enter your email'),
  check('password').exists().withMessage('Enter your password'),
], Login)

router.post('/logout', Logout)

export default router