import express, { Request, Response } from 'express'
const packageJson = require('../../package.json');
import {check} from 'express-validator';

import {
  CreateFeedback,
} from '../controllers/feedback'

import {
  FindAllPerformanceReviewWithoutFeedback
} from '../controllers/perfreview'


// initialize express router
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
})

/**
 * employee routes for performance review feedback
 */
router.post('/feedback', [
  check('performance_reviewId').exists({ checkNull: true }).isUUID('4')
    .withMessage('Provide performance review Id'),
  check('peerId').exists({ checkNull: true })
    .withMessage('Provide the Id of the employee giving the feedback'),
  check('feedback').exists({ checkNull: true })
    .withMessage('Provide user feedback')
], CreateFeedback)

/**
 * Routes for performance reviews requiring feedback
 */
router.get('/perf-reviews/no-feedback', FindAllPerformanceReviewWithoutFeedback);



export default router