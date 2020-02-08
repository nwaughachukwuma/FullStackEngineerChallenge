import User from './user'

export const PerfReview = (sequelize: any, Sequelize: any) => {
    const PerfReview = sequelize.define("perfreview", {
        employeeId: {
            type: Sequelize.STRING, // employeeId as f_key
            references: {
                // This is a reference to another model
                model: User(sequelize, Sequelize),
                // This is the column name of the referenced model
                key: 'id'
            }
        },
        month: {
            type: Sequelize.STRING // perf_review month
        },
        year: {
            type: Sequelize.STRING // perf_review year
        },
        score: {
            type: Sequelize.INTEGER // peer_review score
        },
        remark: {
            type: Sequelize.STRING // perf review remark
        },
        isDone: {
            type: Sequelize.BOOLEAN,  // done|not_done
        }
    });

    return PerfReview;
};

export default PerfReview

