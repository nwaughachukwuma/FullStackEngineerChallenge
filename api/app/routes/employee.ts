import express, { Request, Response } from 'express'
const packageJson = require('../../package.json');
import {
  // checkSchema,
  check,
  param,
  oneOf
} from 'express-validator';

import {
    CreateUserController,
    MeController
} from '../controllers'

import {
    CreateTutorial,
    FindAllTutorial,
    FindOneTutorial,
    UpdateTutorial
} from '../controllers/tutorial'


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

router.post('/user-info', [
  check('name').exists(),
  check('email').exists().isEmail(),
  check('phone').exists().isMobilePhone('any'),
  check('gender').isString(),
  check('country').exists().trim()
], CreateUserController);

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
], UpdateTutorial)

export default router