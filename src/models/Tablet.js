const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('Tablet', {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
            },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Tablet"
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
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        mainCamera: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        screenSize: {
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