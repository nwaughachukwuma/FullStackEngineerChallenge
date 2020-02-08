import bcrypt from 'bcryptjs'
import { omit } from 'lodash'
import { makeId } from '../utils/helpers'

export const User = (sequelize: any, Sequelize: any) => {

    if (!process.env.BCRYPT_SALTING_ROUND) {
        console.log('Add a hash salt to your .env file');
        throw new Error('Add a hash salt to your .env file')
    }

    const User = sequelize.define("user", {
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
        job_definition: {
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
        level: {
            type: Sequelize.STRING,  // done|not_done
            validate: {
                isIn: [['junior', 'mid', 'senior', 'admin', 'executive']]
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

    // remove user password from the returned object
    User.prototype.toJSON = function() {
        return omit(this.dataValues, 'password');
    }

    return User;
};

export default User

