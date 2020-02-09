import { DataTypes } from 'sequelize'
import { makeId } from '../utils/helpers'
import {SequelizeType} from '../utils/types'
import Employee from "./employee";

export const Auth = (sequelize: any, Sequelize: SequelizeType) => {

    const Auth = sequelize.define("auth", {
        id: makeId(Sequelize),
        employeeId: {
            type: DataTypes.STRING, // id of the employee that got authenticated
            allowNull: false,
            references: {
                // References the user model
                model: Employee(sequelize, Sequelize),
                // on the id (uuid) column
                key: 'id'
            },
            unique: 'compositeIndex', // use a composite index
        },
        accessToken: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        lastLoginAt: {
            type: 'TIMESTAMP',
        }
    });

    return Auth;
};

export default Auth

