const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('Product', {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
            },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },

    },
    {
        timestamps: false
    }
    );
}