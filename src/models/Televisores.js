const {DataTypes} = require('sequelize')

module.exports= (sequelize) =>{
    sequelize.define('Televisores',{
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
                    msg:'El tipo de resolution debe contener entre 3 a 50 caracteres'
                },
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
                return `${valor} pulgadas (${parseInt(valor)*2.54} cm)`
            }
        }
    },{
        timestamps:false
    });
}