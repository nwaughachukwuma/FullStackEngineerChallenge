import User from './employee'
import {makeId} from '../utils/helpers'
import { DataTypes} from 'sequelize'
import {SequelizeType} from '../utils/types'


/**
 * Define Model for performance review
 * The approach is to ensure that only one instance of performance
 * review exist per user per month for a single year.
 * @param sequelize 
 * @param Sequelize 
 */
export const PerformanceReview = (sequelize: any, Sequelize: SequelizeType) => {
    const PerformanceReview = sequelize.define("performance_review", {
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
            type: DataTypes.STRING, // performance_review month
            unique: 'compositeIndex', // use a composite index
        },
        year: {
            type: DataTypes.STRING, // performance_review year
            unique: 'compositeIndex' // use a composite index
        },
        evaluation: {
            type: DataTypes.INTEGER, // performance_review evaluation
            validate: {
                isNumeric: true,
                min: 40, // no score < 40
                max: 100
            }
        },
        remark: {
            type: DataTypes.STRING // performance_review remark by admin
        },
        isReviewed: {
            type: DataTypes.BOOLEAN,  // whether the employee has been reviewed
            allowNull: false
        }
    });

    // PerformanceReview.prototype.toJSON = function() {
    //     return {...this.dataValues, reviewer_object: this.getReviewer()}
    // }

    return PerformanceReview;
};

export default PerformanceReview

