import PerfReview from "./perfreview";

export const Feedback = (sequelize: any, Sequelize: any) => {
    const Feedback = sequelize.define("feedback", {
        perfreviewId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                // This is a reference to another model
                model: PerfReview(sequelize, Sequelize),
                // This is the column name of the referenced model
                key: 'id'
            }
        },
        feedbackEmployeeId: {
            type: Sequelize.STRING, // id of the employee giving the feedback
            allowNull: false,
        },
        feedback: {
            type: Sequelize.STRING // peer_review score
        }
    });

    return Feedback;
};

export default Feedback

