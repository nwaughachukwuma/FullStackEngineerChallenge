import {Sequelize, DataTypes} from 'sequelize'
import PerfReview from "./perfreview";
import {makeId} from '../utils/helpers'
import User from "./user";

/**
 * Model definition for employee feedback
 * An employee can only give one feedback on a particular perf-review
 * Composite keys are perfreviewId and peerId
 * @param sequelize 
 * @param Sequelize 
 */
export const Feedback = (sequelize: any, Sequelize: Sequelize) => {
    const Feedback = sequelize.define("feedback", {
        id: makeId(Sequelize),
        perfreviewId: {
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
            type: DataTypes.STRING, // peer_review score
            allowNull: false
        }
    });

    return Feedback;
};

export default Feedback

