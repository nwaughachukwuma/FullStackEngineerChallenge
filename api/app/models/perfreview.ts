import User from './user'
import {makeId} from '../utils/helpers'
import {Sequelize, DataTypes} from 'sequelize'


/**
 * Define Model for performance review
 * The approach is to ensure that only one instance of performance
 * review exist per user per month for a single year.
 * @param sequelize 
 * @param Sequelize 
 */
export const PerfReview = (sequelize: any, Sequelize: Sequelize) => {
    const PerfReview = sequelize.define("perfreview", {
        id: makeId(Sequelize),
        employeeId: {
            type: DataTypes.STRING, // employeeId as foreign_key
            references: {
                // References the user model
                model: User(sequelize, Sequelize),
                // on the Id (uuid) column
                key: 'id'
            },
            unique: 'compositeIndex' // use a composite index
        },
        month: {
            type: DataTypes.STRING, // perf_review month
            unique: 'compositeIndex', // use a composite index
        },
        year: {
            type: DataTypes.STRING, // perf_review year
            unique: 'compositeIndex' // use a composite index
        },
        score: {
            type: DataTypes.INTEGER // peer_review score
        },
        remark: {
            type: DataTypes.STRING // perf review remark
        },
        isDone: {
            type: DataTypes.BOOLEAN,  // whether the employee has been reviewed
        }
    });

    return PerfReview;
};

export default PerfReview

