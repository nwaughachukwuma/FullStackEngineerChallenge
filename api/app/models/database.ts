import { DBConfig } from '../config'
import { Sequelize } from "sequelize";
import { Tutorial } from './tutorial'


const sequelize = new Sequelize(DBConfig.DB, DBConfig.USER, DBConfig.PASSWORD, {
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

const db = {
    Sequelize,
    sequelize,
    tutorials: Tutorial(sequelize, Sequelize)
};

export default db;