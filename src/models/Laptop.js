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
            defaultValue: "Laptop",
            validate: {
                notEmpty: {
                    msg: "El nombre no puede estar vacío"
                },
                len: {
                    args: [3, 50],
                    msg: "El nombre debe tener entre 3 y 50 caracteres"
                }
            }
        },
        ramMemory: {
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
        internalMemory: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                notEmpty: {
                    msg: "La cantidad de memoria interna no puede estar vacía"
                },
                len: {
                    args: [1, 50],
                    msg: "La cantidad de memoria interna debe tener entre 1 y 50 caracteres"
                }
            }
        },
        processor: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                notEmpty: {
                    msg: "El nombre del procesador no puede estar vacío"
                },
                len: {
                    args: [3, 50],
                    msg: "El nombre del procesador debe tener entre 3 y 50 caracteres"
                    }
                }
            },

    },
    {
        timestamps: false
    }
    );
}