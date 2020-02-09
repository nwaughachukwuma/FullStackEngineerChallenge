import express, { Request, Response } from 'express'
const packageJson = require('../../package.json');
import {check, query, sanitizeQuery} from 'express-validator';

import {
  GiveFeedback,
  FindAllAssignedPendingReviews,
  FindAllAssignedReviews
} from '../controllers/reviewer'

import {
  FindAllPerformanceReviewsPendingFeedback
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
router.put('/give-feedback/:prId', [
  check('performanceReviewId').exists({ checkNull: true }).isUUID('4')
    .withMessage('Provide performance review Id'),
  check('peerId').exists({ checkNull: true })
    .withMessage('Provide the Id of the employee giving the feedback'),
  check('feedback').exists({ checkNull: true })
    .withMessage('Provide user feedback')
], GiveFeedback);

/**
 * Routes for performance reviews requiring feedback
 */
// router.get('/perf-reviews/pending-feedback', FindAllPerformanceReviewsPendingFeedback);
router.get('/pending-reviews/:peerId', FindAllAssignedPendingReviews);
router.get('/assigned-reviews', FindAllAssignedReviews);

export default router