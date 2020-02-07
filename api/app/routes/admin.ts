import express, { Request, Response } from 'express'
const packageJson = require('../../package.json');
import {
  // checkSchema,
  check,
  validationResult
} from 'express-validator';

import {
  CreatePerfReview
} from '../controllers/perfreview'

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

router.post('/user-info', [
  check('name').exists(),
  check('email').exists().isEmail(),
  check('phone').exists().isMobilePhone('any'),
  check('gender').isString(),
  check('country').exists().trim()
], async (req: Request, res: Response) => {

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return res.status(200).send({
    success: true,
    data: {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      country: req.body.country,
      github: 'https://github.com/nwaughachukwuma'
    }
  })
});

// create routes for performance review
router.post('/perfreview', [
  check('employeeId').isInt().toInt().withMessage('Provide Employee Id'),
  check('month').exists().withMessage('Provide Performance review month'),
  check('year').exists().withMessage('Provide performance review year'),
  check('score').isInt().toInt().withMessage('Provide performance review score'),
  check('remark').exists().withMessage('Provide performance review remark'),
  check('isDone'),
], CreatePerfReview)

export default router