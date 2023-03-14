const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    sequelize.define('Category',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                notNull:{
                    msg:'El nombre de la cartegoria es requerido'
                },
                len:{
                    args:[3,60],
                    msg:'El nombre debe contener entre 3 a 40 caracteres'
                },
            }
        }
    },{
        timestamps:false
    });
}