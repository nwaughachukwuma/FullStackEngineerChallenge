import uuidv4 from 'uuid/v4';
import { DataTypes } from 'sequelize';

export const makeId = (Sequelize: any, customFields: any = {}) => ({
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4(),
    validate: {
        isUUID: 4
    },
    unique: true,
    autoIncrement: false,
    ...customFields
});