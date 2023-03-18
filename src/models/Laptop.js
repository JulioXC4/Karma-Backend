const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('Laptop', {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
            },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Laptop"
        },
        ramMemory: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        internalMemory: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        processor: {
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