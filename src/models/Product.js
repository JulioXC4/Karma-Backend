const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('Product', {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
            },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        brand: {
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
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: []
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        averageRating: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        }, 

    },
    {
        timestamps: false
    }
    );
}