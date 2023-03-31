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
                },
                notNull:{
                    msg:'La fecha debe ser requerida'
                }
            }
        },
        orderStatus:{
            type:DataTypes.ENUM('Procesando','Enviado','Entregado'),
            allowNull:false,
            defaultValue:"Procesando",
            validate:{
                notNull:{
                    msg:'El estado del pedido debe ser requerido'
                },
                isIn:{
                    args:[['Procesando','Enviado','Entregado']],
                    msg:"No esta dentro de las opciones permitidas"
                }
            }
        }
    },{
        timestamps:false
    });
}