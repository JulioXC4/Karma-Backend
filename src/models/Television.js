const {DataTypes} = require('sequelize')

module.exports= (sequelize) =>{
    sequelize.define('Television',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{
                    msg:'El nombre del televisor es requerido'
                },
                len:{
                    args:[3,200],
                    msg:'El nombre debe TV contener entre 3 a 200 caracteres'
                },
                isString(value,next){
                    if (typeof value === 'string') {
                        return next()
                    }
                    return next(new Error("El name en TV debe ser un string"))
                }
            }
        },
        typeResolution:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{
                    msg:'El tipo de resolucion es requerido'
                },
                len:{
                    args:[1,50],
                    msg:'El tipo de resolution debe contener entre 3 a 50 caracteres'
                },
                isString(value,next){
                    if (typeof value === 'string') {
                        return next()
                    }
                    return next(new Error("El tipo de resolucion debe ser un string"))
                }
            }
        },
        systemOperating:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{
                    msg:'El sistema operativo es requerido'
                },
                len:{
                    args:[3,150],
                    msg:'El nombre SO debe contener entre 3 a 150 caracteres'
                },
                isString(value,next){
                    if (typeof value === 'string') {
                        return next()
                    }
                    return next(new Error("El SO debe ser un string"))
                }
            }
        },
        screenSize:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                isInt:{
                    args:[{min:0,max:999}],
                    msg:'El valor de las pulgadas debe ser un número entero y estar en un rango de 1 a 3 dígitos.'
                }
            },
            
        }
    },{
        timestamps:false
    });
}