import { NextFunction, Request, Response } from 'express'
import {verifyToken} from '../utils/helpers'
import {userAuth} from '../utils/types'
import {DBModel} from '../models'

// add user property to the Request class
declare global {
  namespace Express {
    interface Request {
      user: userAuth["decodedToken"] | null
    }
  }
}

const noIDTokenMessage = `
  No entry was passed as a Bearer token in the Authorization header.
  Please ensure you authorize your request by providing the following HTTP header:
  Authorization: Bearer <token>, or by passing a "__session" cookie.
`

const unAuthorizedMessage = 'Unauthorized access is not allowed'
const Auth = DBModel.auths;

/** 
 * Middleware to validate user Auth Tokens passed in the Authorization HTTP header.
 * The auth token needs to be passed as a Bearer token in the Authorization HTTP header like this:
 * `Authorization: Bearer <token>`.
 * when decoded successfully, the token content will be added as `req.user`.
 */
const validateAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} - ${req.originalUrl}`)
  console.log('Check if request is authorized with valid auth token')

  // to enable token validation after setting up jwt

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
    console.error(noIDTokenMessage)
    res.status(403).send({error: unAuthorizedMessage})
    return
  }

  let accessToken
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header')
    // Read the ID Token from the Authorization header.
    accessToken = req.headers.authorization.split(' ')[1]
  } else if(req.cookies) {
    console.log('Found "__session" cookie')
    // Read the ID Token from cookie.
    accessToken = req.cookies.__session
  } else {
    // No cookie
    res.status(403).send({error: unAuthorizedMessage})
    return
  }

  try {
    const decodedToken = await verifyToken(accessToken)
    if (!decodedToken) throw new Error('Invalid access token')
   
    const userAuth = await Auth.findOne({where: {accessToken: accessToken}});

    console.log('Checking if token has correct referenced >>>', userAuth)
    if (!userAuth) throw new Error('Invalid access token, login again')

    console.log('ID Token correctly decoded', decodedToken)
    //  add the decoded token to the request object
    req.user = decodedToken
    next()
    return
  } catch (error) {
    console.error('Error while verifying users auth token:', error.message)
    res.status(403).send({error: unAuthorizedMessage, message: error.message})
    return
  }
}

const escapeRoute  = function(paths: any, middleware: any) {
    return function(req: Request, res: Response, next: NextFunction) {
        if (paths.includes(req.path)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

export { validateAuthToken, escapeRoute }