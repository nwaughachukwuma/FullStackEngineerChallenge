export const Tutorial = (sequelize: any, Sequelize: any) => {
    const Tutorial = sequelize.define("tutorial", {
        author: {
            type: Sequelize.STRING
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        published: {
            type: Sequelize.BOOLEAN
        }
    });

    return Tutorial;
};

export default Tutorial

