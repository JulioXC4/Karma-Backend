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
                len: {
                    args: [2, 50],
                    msg: "El nombre debe tener entre 2 y 50 caracteres"
                }
            }
        },
        ram: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "La cantidad de memoria RAM no puede estar vacía"
                },
                len: {
                    args: [1, 50],
                    msg: "La cantidad de memoria RAM debe tener entre 1 y 50 caracteres"
                }
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
                len: {
                    args: [1, 50],
                    msg: "La cantidad de memoria RAM debe tener entre 1 y 50 caracteres"
                }
            }
        },
        mainCamera: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "La cámara principal no puede estar vacía"
              },
              matches: {
                args: /^(\d+)MP$/,
                msg: "La cámara principal debe tener el formato 'númeroMP'"
              }
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
                maxArrayLength: {
                    args: [5],
                    msg: "La cantidad de colores no puede ser mayor a 5"
                }
            }
        },
    },
    {
        timestamps: false
    }
)}
