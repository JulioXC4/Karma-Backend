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
                notEmpty: {
                    msg: "El nombre no puede estar vacío"
                },
            }
        },
        ramMemory: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "La cantidad de memoria RAM no puede estar vacía"
                },
            }
        },
        internalMemory: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                notEmpty: {
                    msg: "La cantidad de memoria RAM no puede estar vacía"
                },
            }
        },
        mainCamera: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "La cámara principal no puede estar vacía"
              },
            
            }
        },
        colors: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            validate: {
                notEmpty: {
                    msg: "Debe indicar al menos un color"
                },
            }
        },
    },
    {
        timestamps: false
    }
)}
