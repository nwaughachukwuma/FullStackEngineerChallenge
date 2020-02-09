import { DataTypes } from 'sequelize'
import PerfReview from "./perfreview";
import {makeId} from '../utils/helpers'
import User from "./employee";
import {SequelizeType} from '../utils/types'

/**
 * Model definition for employee feedback
 * An employee can only give one feedback on a particular perf-review
 * Composite keys are perfreviewId and peerId
 * @param sequelize 
 * @param Sequelize 
 */
export const Reviewer = (sequelize: any, Sequelize: SequelizeType) => {
    const Reviewer = sequelize.define("reviewer", {
        id: makeId(Sequelize),
        performanceReviewId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                // References the perf-review model
                model: PerfReview(sequelize, Sequelize),
                // on the id (uuid) column
                key: 'id'
            },
            unique: 'compositeIndex', // use a composite index
        },
        peerId: {
            type: DataTypes.STRING, // id of the employee giving the feedback
            allowNull: false,
            references: {
                // References the user model
                model: User(sequelize, Sequelize),
                // on the id (uuid) column
                key: 'id'
            },
            unique: 'compositeIndex', // use a composite index
        },
        feedback: {
            type: DataTypes.STRING, // peer_review feedback
            allowNull: false,
            defaultValue: ''
        }
    });

    return Reviewer;
};

export default Reviewer

