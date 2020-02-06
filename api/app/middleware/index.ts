import { NextFunction, Request, Response } from 'express'

// add user property to the Request class
declare global {
  namespace Express {
    interface Request {
      user: 'admin.auth.DecodedIdToken'
    }
  }
}

const noIDTokenMessage = `
  No entry was passed as a Bearer token in the Authorization header.
  Please ensure you authorize your request by providing the following HTTP header:
  Authorization: Bearer <token>, or by passing a "__session" cookie.
`

/** 
 * Middleware to validate user Auth Tokens passed in the Authorization HTTP header.
 * The auth token needs to be passed as a Bearer token in the Authorization HTTP header like this:
 * `Authorization: Bearer <token>`.
 * when decoded successfully, the token content will be added as `req.user`.
 */
const validateAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} - ${req.originalUrl}`)
  console.log('Check if request is authorized with Firebase ID token')

  // to enable token validation after setting up jwt

  // if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
  //     !(req.cookies && req.cookies.__session)) {
  //   console.error(noIDTokenMessage)
  //   res.status(403).send('Unauthorized')
  //   return
  // }

  // let idToken
  // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
  //   console.log('Found "Authorization" header')
  //   // Read the ID Token from the Authorization header.
  //   idToken = req.headers.authorization.split('Bearer ')[1]
  // } else if(req.cookies) {
  //   console.log('Found "__session" cookie')
  //   // Read the ID Token from cookie.
  //   idToken = req.cookies.__session
  // } else {
  //   // No cookie
  //   res.status(403).send('Unauthorized')
  //   return
  // }

  try {
    // const checkRevoked = true;
    // const decodedIdToken = await getAuthRef().verifyIdToken(idToken, checkRevoked)
    // console.log('ID Token correctly decoded', decodedIdToken)
    //  add the decoded token to the request object
    // req.user = decodedIdToken
    next()
    return
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error)
    res.status(403).send('Unauthorized')
    return
  }
}

export { validateAuthToken }