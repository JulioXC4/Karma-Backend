const { DataTypes } = require("sequelize")
const {regexPhoneNumber} = require('../utils/consts.js')

module.exports = (sequelize)=>{
    sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            defaultValue:"",
            allowNull: false,
            primaryKey: true
            },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                len: [4, 255]
            }
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                len: [4, 255]
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                len: [4, 255]
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                len: [4, 255]
            }
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: sequelize.literal("NOW()"),
            set(value) {
                if (value === "none") {
                  this.setDataValue('birthdate', new Date());
                } else {
                  this.setDataValue('birthdate', value);
                }
            }
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "0",
            validate: {
                isPhoneNumber: function (value) {
                    if (value !== "none" && !regexPhoneNumber.test(value)) {
                        throw new Error("El número de teléfono no es válido");
                    }
                },
            },
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                len: [2, 255]
            }
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                len: [2, 255]
            }
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
            validate: {
                len: [2, 255]
            }
        },

    },
    {
        timestamps: false
    }
    );
}