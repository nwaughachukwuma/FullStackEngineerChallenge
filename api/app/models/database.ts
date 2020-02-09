import { DBConfig } from '../config'
import { Sequelize } from "sequelize";
import { PerformanceReview } from './perfreview'
import { Reviewer } from './reviewer'
import { Employee } from './employee';
import { Auth } from './auth';


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
const ReviewerModel = Reviewer(sequelize, Sequelize);
const PerformanceReviewModel = PerformanceReview(sequelize, Sequelize)
const EmployeeModel = Employee(sequelize, Sequelize);
const AuthModel = Auth(sequelize, Sequelize)

// define associations
// 1. user to performance reviews
EmployeeModel.hasMany(PerformanceReviewModel);
PerformanceReviewModel.belongsTo(EmployeeModel);

// 2. Performance reviews to Reviewer
PerformanceReviewModel.hasMany(ReviewerModel, {
    foreignKey: 'performanceReviewId'
});
ReviewerModel.belongsTo(PerformanceReviewModel);

// 3. Employee to auth
EmployeeModel.hasOne(AuthModel)
AuthModel.belongsTo(EmployeeModel)

const db = {
    Sequelize,
    sequelize,
    performance_reviews: PerformanceReviewModel,
    reviewers: ReviewerModel,
    employees: EmployeeModel,
    auths: AuthModel
};

export default db;