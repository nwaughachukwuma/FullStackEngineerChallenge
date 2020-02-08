import uuidv4 from 'uuid/v4'

export const makeId = (Sequelize: any, customFields: any = {}) => ({
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4(),
    validate: {
        isUUID: 4
    },
    unique: true,
    autoIncrement: false,
    ...customFields
})