const {DataTypes} = require('sequelize')

module.exports= (sequelize) =>{
    sequelize.define('Televisores',{
        id:{
            type: DataTypes.STRING,
            defaultValue:"",
            allowNull: false,
            primaryKey: true
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
                    msg:'El nombre debe contener entre 3 a 200 caracteres'
                },
                isString:{
                    msg:'Debe ser un string'
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
                    args:[3,50],
                    msg:'El nombre debe contener entre 3 a 50 caracteres'
                },
                isString:{
                    msg:'Debe ser un string'
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
                    msg:'El nombre debe contener entre 3 a 150 caracteres'
                },
                isString:{
                    msg:'Debe ser un string'
                }
            }
        },
        tamañoPantalla:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                isInt:{
                    args:[{min:0,max:100}],
                    msg:'Las pulgadas deben ser en un rango de 2 digitos y debe ser entero'
                }
            },
            get(){
                let valor = this.getDataValue('tamañoPantalla')
                return valor+`" (${parseInt(valor)*2.54} cm)`
            }
        }
    });
}