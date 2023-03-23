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
            validate: {
              min: 1,
              max: 5,
            }
        },
        reviewed: {
            type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
          },
        
    },
    {
        timestamps: false
    }
    );
}