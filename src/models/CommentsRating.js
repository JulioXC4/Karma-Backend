const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('CommentsRating', {
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
        rating: {
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
          state: {
            type: DataTypes.STRING,
            allowNull: true
         },
    },
    {
        timestamps: false
    }
    );
}