
export const Feedback = (sequelize: any, Sequelize: any) => {
    const Feedback = sequelize.define("feedback", {
        perfreviewId: {
            type: Sequelize.STRING // employeeId as f_key
        },
        feedback: {
            type: Sequelize.STRING // peer_review score
        },
        status: {
            type: Sequelize.BOOLEAN,  // has gotten feedback or not
        }
    });

    return Feedback;
};

export default Feedback

