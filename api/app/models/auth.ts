import bcrypt from 'bcryptjs'
import { DBModel } from '../models';
import { LoginParams, UserCredentials } from '../utils/types'


const Employee = DBModel.employees;

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

    // go to generating jwt with the user credentials

};

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

