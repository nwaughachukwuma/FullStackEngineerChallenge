import bcrypt from 'bcryptjs'
import { omit } from 'lodash'
import { makeId } from '../utils/helpers'

export const Employee = (sequelize: any, Sequelize: any) => {

    if (!process.env.BCRYPT_SALTING_ROUND) {
        console.log('Add a hash salt to your .env file');
        throw new Error('Add a hash salt to your .env file')
    }

    const Employee = sequelize.define("employee", {
        id: makeId(Sequelize),
        email: {
            type: Sequelize.STRING, // perf_review year
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: Sequelize.STRING, // password
            allowNull: false,
            defaultValue: bcrypt.hashSync('123456',
                bcrypt.genSaltSync(
                    +process.env.BCRYPT_SALTING_ROUND!
                )
            ),
            scopes: false // Don't EVER include
        },
        name: {
            type: Sequelize.STRING, // employee full name
            allowNull: false,
        },
        gender: {
            type: Sequelize.STRING, // employee phone
            validate: {
                isIn: [['male', 'female']],
            }
        },
        phone: {
            type: Sequelize.STRING, // employee phone
            allowNull: true,
            validate: {
                len: [10, 15]
            }
        },
        jobDefinition: {
            type: Sequelize.STRING, // employee position: e.g. software developer or HR
            allowNull: true,
        },
        role: {
            type: Sequelize.STRING, // employee role
            defaultValue: 'user',
            validate: {
                isIn: [['admin', 'staff', 'user']]
            }
        },
        rank: {
            type: Sequelize.STRING,  // done|not_done
            allowNull: true,
            validate: {
                isIn: [['junior', 'mid', 'senior', 'executive']]
            }
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: 'pending',
            validate: {
                isIn: [['active', 'deleted', 'pending']]
            }
        }
    });

    // remove employee password from the returned object
    Employee.prototype.toJSON = function() {
        return omit(this.dataValues, 'password');
    }

    return Employee;
};

export default Employee

