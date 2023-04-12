const { DataTypes } = require("sequelize")

module.exports = (sequelize)=>{
    sequelize.define('ProductDiscount', {
        id: {
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
            },
        startingDate: {
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: sequelize.literal("NOW()"),
        },
        endingDate: {
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue: sequelize.literal(`NOW() + INTERVAL '1 day'`),
        },
        discountValue: {
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue: 0,
            validate: {
                isInt: {
                    args: [0, 100],
                    msg: "El valor del descuento debe ser un entero entre 0 y 100"
                }
            }
        },
    },
    {
        timestamps: false
    }
    )
}