const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('CellPhone', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull:false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            notEmpty: true
            }
        },
        ram: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            notEmpty: true
            }
        },
        internalMemory: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            notEmpty: true
            }
        },
        mainCamera: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            notEmpty: true
            }
        },
        colors: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
    },
    {
        timestamps: false
    }
)}

/* mainCamera: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            notEmpty: true
            }
        },*/