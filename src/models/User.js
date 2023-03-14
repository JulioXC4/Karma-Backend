const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            defaultValue:"",
            allowNull: false,
            primaryKey: true
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
            allowNull: false,
            defaultValue: sequelize.literal("NOW()"),
            validate: {
                isDate: true 
            }
        },
        phoneNumber: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: 0,
            validate: {
                isNumeric: true 
            }
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