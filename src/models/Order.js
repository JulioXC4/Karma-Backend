const { DataTypes } = require("sequelize")

module.exports = (sequelize) =>{
    sequelize.define('Order',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
        },
        datePurchase:{
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue:sequelize.literal("NOW()"),
            validate:{
                isDate:{
                    args:true,
                    msg:'No es una cadena de fecha'
                }
            }
        },
        orderStatus:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:true,
            validate:{
                isBoolean:{
                    args:true,
                    msg:'Debe contener un booleano en el campo'
                },
            }
        }
    },{
        timestamps:false
    });
}