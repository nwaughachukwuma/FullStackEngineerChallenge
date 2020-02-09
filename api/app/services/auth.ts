import bcrypt from 'bcryptjs'
import {isEmpty} from 'lodash'
import dayjs from 'dayjs'
import { DBModel } from '../models';
import { 
    LoginParams, 
    UserCredentials, 
    EmployeeType 
} from '../utils/types'
import {generateToken} from '../utils/helpers'


const Employee = DBModel.employees;
const Auth = DBModel.auths

/**
 * Process user registration action
 * @param userDetails 
 */
export const RegisterUser = async (userDetails: typeof Employee) => {

    const {
        name,
        email,
        password,
        phone,
        gender
    } = userDetails;

    const hashPass = bcrypt.hashSync(password,
        bcrypt.genSaltSync(
            +process.env.BCRYPT_SALTING_ROUND!
        ));

    const admin_data = {
        name,
        email,
        password: hashPass,
        phone,
        gender
    }

    // Save a new User in the database
    return await Employee.create(admin_data);
};

/**
 * Process user login action
 * @param userDetails 
 */
export const LoginUser = async (userDetails: LoginParams) => {

    const {
        email,
        password
    } = userDetails

    const userCredentials: UserCredentials = await Employee.findOne({where: {email: email}})
        .then(async (data: any) => {
            // Load hash from your password DB.
            const result = await bcrypt.compare(password, data.password);

            if (!result) return { isValid: result }

            const userData = { ...data.dataValues };
            delete userData.password;
            return  { ...userData, isValid: result };
        });

    if (!userCredentials.isValid) {
        throw new Error('Wrong login credentials')
    }

    // if the user status is not yet active
    if (userCredentials.status === 'pending') {
        try {
            return await Employee.update({status: 'active'}, {
                where: { email: email }
            });
        } catch (error) {
            throw new Error(error.message)
        }
    }

    try {
        // generate jwt with the user credentials
        const jwtToken = tokenGenerator(userCredentials);
        const newAuth = {
            employeeId: userCredentials.id,
            accessToken: jwtToken,
            lastLoginAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        }

        const existingAuth = await Auth.findOne({where: {
            employeeId: newAuth.employeeId}
        });

        if (!isEmpty(existingAuth)) {
            delete newAuth.employeeId
            await Auth.update(newAuth, {where: 
                {employeeId: userCredentials.id}
            })
        } else {
            // create new auth object
            await Auth.create(newAuth);
        }
        return jwtToken;
    } catch (error) {
        throw new Error(error.message)
    }

};

/**
 * Generate jwt
 */
const tokenGenerator = (userData: EmployeeType) => {

    const data = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      };
    
      return generateToken(data);
}
