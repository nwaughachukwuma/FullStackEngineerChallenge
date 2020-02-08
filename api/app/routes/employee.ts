import express, { Request, Response } from 'express'
const packageJson = require('../../package.json');
import {
  // checkSchema,
  check,
  param,
  oneOf
} from 'express-validator';

import {
    MeController
} from '../controllers'

import {
    CreateTutorial,
    FindAllTutorial,
    FindOneTutorial,
    UpdateTutorial
} from '../controllers/tutorial'

import {
  CreateFeedback
} from '../controllers/feedback'


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

router.get('/me', MeController)
// .get([isAuthenticated, checkSchema(me.meGet)], meController.getMe)
// .post([isAuthenticated, checkSchema(me.mePatch)], meController.patchMe);

// create routes for tutorial
router.post('/tutorial', [
    check('author').exists().withMessage('Provide tutorial author'),
    check('title').exists().withMessage('Provide tutorial title'),
    check('description').exists().withMessage('Provide tutorial description'),
    check('published'),
], CreateTutorial)
router.get('/tutorials', FindAllTutorial)
router.get('/tutorials/:id', [
    param('id').exists().isInt()
        .withMessage('Provide tutorial index')
        .matches(/\d/g).withMessage('index must be a number'),
], FindOneTutorial)
router.put('/tutorials/:id', [
    check('title').optional(),
    check('description').optional(),
    check('published').isBoolean().optional(),
    param('id').isInt().withMessage('Provide tutorial index'),
], UpdateTutorial);

// create routes for performance review
router.post('/feedback', [
  check('perfreviewId').exists({checkNull: true}).isUUID('4')
    .withMessage('Provide performance review Id'),
  check('peerId').exists({checkNull: true})
    .withMessage('Provide the Id of the employee giving the feedback'),
  check('feedback').exists({checkNull: true})
    .withMessage('Provide user feedback')
], CreateFeedback)



export default router