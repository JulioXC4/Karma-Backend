const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Tablet",{
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Tablet",
        validate: {
          notEmpty: {
            msg: "El nombre es obligatorio"
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
      colors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        validate: {
          notEmpty: {
            msg: "Debe especificar al menos un color"
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
        }
      },
      screenSize:{
        type:DataTypes.FLOAT,
        allowNull:false,
        validate:{
            isFloat:{
                args:[{min:0,max:999}],
                msg:'El valor de las pulgadas debe ser un número entero y estar en un rango de 1 a 3 dígitos.'
            }
        },
        get(){
            let valor = this.getDataValue('screenSize')
            return `${valor} pulgadas (${parseInt(valor)*2.54} cm)`
        }
    }
    },
    {
      timestamps: false,
    }
  );
};
