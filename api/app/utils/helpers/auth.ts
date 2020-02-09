import jwt, {Secret} from 'jsonwebtoken'
import { logger } from '../../logger';
import {EmployeeType} from '../types'


const moduleLogger = logger.child({ module: 'authentication' });
const secretKey: Secret = process.env.JWT_SECRET_KEY!;
const expiresIn = process.env.JWT_EXPIRES_IN;

export const generateToken = (data: EmployeeType) => {
  moduleLogger.debug('generating new token', { expiresIn });
  return jwt.sign(data, secretKey, {
    algorithm: 'HS256',
    expiresIn
  });
};

export const verifyToken = async (jwtToken: any) => {
  try {
    // @ts-ignore
    return await jwt.verify(jwtToken, secretKey, { algorithm: 'HS256' }); 
  } catch (e) {
    moduleLogger.error({ e });
    return null;
  }
};