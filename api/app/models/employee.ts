import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import { omit } from 'lodash'
import { makeId } from '../utils/helpers'
import {SequelizeType} from '../utils/types'

export const Employee = (sequelize: any, Sequelize: SequelizeType) => {

    if (!process.env.BCRYPT_SALTING_ROUND) {
        console.log('Add a hash salt to your .env file');
        throw new Error('Add a hash salt to your .env file')
    }

    const Employee = sequelize.define("employee", {
        id: makeId(Sequelize),
        email: {
            type: DataTypes.STRING, // perf_review year
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING, // password
            allowNull: false,
            defaultValue: bcrypt.hashSync('123456',
                bcrypt.genSaltSync(
                    +process.env.BCRYPT_SALTING_ROUND!
                )
            ),
        },
        name: {
            type: DataTypes.STRING, // employee full name
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING, // employee phone
            validate: {
                isIn: [['male', 'female']],
            }
        },
        phone: {
            type: DataTypes.STRING, // employee phone
            allowNull: true,
            validate: {
                len: [10, 15]
            }
        },
        jobDefinition: {
            type: DataTypes.STRING, // employee position: e.g. software developer or HR
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING, // employee role
            defaultValue: 'staff',
            validate: {
                isIn: [['admin', 'staff', 'user']]
            }
        },
        rank: {
            type: DataTypes.STRING,  // done|not_done
            allowNull: true,
            validate: {
                isIn: [['junior', 'mid', 'senior', 'executive']]
            }
        },
        status: {
            type: DataTypes.STRING,
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

