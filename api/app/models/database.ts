import { DBConfig } from '../config'
import { Sequelize } from "sequelize";
import { PerformanceReview } from './perfreview'
import { Feedback } from './feedback'
import { Employee } from './employee';


export const sequelize = new Sequelize(DBConfig.DB, DBConfig.USER, DBConfig.PASSWORD, {
    host: DBConfig.HOST,
    dialect: DBConfig.dialect,
    //   operatorsAliases: false,
    pool: {
        max: DBConfig.pool.max,
        min: DBConfig.pool.min,
        acquire: DBConfig.pool.acquire,
        idle: DBConfig.pool.idle
    }
});

// instantiate the models
const FeedbackModel = Feedback(sequelize, Sequelize);
const PerformanceReviewModel = PerformanceReview(sequelize, Sequelize)
const EmployeeModel = Employee(sequelize, Sequelize);

// define associations
// 1. user to performance reviews
EmployeeModel.hasMany(PerformanceReviewModel);
PerformanceReviewModel.belongsTo(EmployeeModel);

// 2. Performance reviews to feedback
PerformanceReviewModel.hasMany(FeedbackModel);
FeedbackModel.belongsTo(PerformanceReviewModel)

const db = {
    Sequelize,
    sequelize,
    performance_reviews: PerformanceReviewModel,
    feedbacks: FeedbackModel,
    employees: EmployeeModel
};

export default db;