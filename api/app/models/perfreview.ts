export const PerfReview = (sequelize: any, Sequelize: any) => {
    const PerfReview = sequelize.define("perfreview", {
        employeeId: {
            type: Sequelize.STRING // employeeId as f_key
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

