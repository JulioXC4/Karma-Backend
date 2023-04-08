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
            allowNull: true,
        },
    },
    {
        timestamps: false
    }
    );
}