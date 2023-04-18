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
            type:DataTypes.ENUM('Orden Creada','Orden Pagada','Orden Rechazada','Procesando Orden','Enviando','Entregado'),
            allowNull:false,
            defaultValue:"Orden Creada",
            validate:{
                notNull:{
                    msg:'El estado del pedido debe ser requerido'
                },
                isIn:{
                    args:[['Orden Creada','Orden Pagada','Orden Rechazada','Procesando Orden','Enviando','Entregado']],
                    msg:"No esta dentro de las opciones permitidas"
                }
            }
        }
    },{
        timestamps:true
    });
}