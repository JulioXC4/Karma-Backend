const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('Model', {
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

          },
          {
            timestamps: false
          }
      );
}