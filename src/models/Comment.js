const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('Comment', {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
            },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: sequelize.literal("NOW()"),
        }
    },
    {
        timestamps: false
    }
    );
}