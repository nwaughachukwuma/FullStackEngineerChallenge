require('dotenv').config();

type DBConfigTypes = {
    HOST: string,
    USER: string,
    PASSWORD: string,
    DB: string,
    dialect: 'mysql'|'postgres'|'sqlite'|'mssql'|'mariadb',
    pool: {
        max: number,
        min: number,
        acquire: number,
        idle: number
    }
};

const DBConfig: DBConfigTypes = {
    HOST: process.env.DB_HOST || "localhost",
    USER: process.env.DB_USERNAME || "root",
    PASSWORD: process.env.DB_PASSWORD || "123456",
    DB: process.env.DB_DATABASE || "testdb",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

export default DBConfig;