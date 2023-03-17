const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('CommentsRaiting', {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
            },
        comments: {
            type: DataTypes.TEXT,
            allowNull: true,
           
        },
        raiting: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    },
    {
        timestamps: false
    }
    );
}