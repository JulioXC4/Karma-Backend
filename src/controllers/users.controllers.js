const {User} = require('../db.js');
const {regexPhoneNumber} = require('../utils/utils.js')

    const createUser = async (req, res) => {

        try {

        const { id, name, lastName, birthdate, phoneNumber, city, country, address } = req.body

        const errors = [];

        if (!id) {
          errors.push('El campo "id" es obligatorio.');
        }

        if (!name || typeof name !== 'string' || name.length < 2) {
          errors.push('El campo "name" debe tener al menos 2 caracteres.');
        }

        if (!lastName || typeof lastName !== 'string' || lastName.length < 2) {
          errors.push('El campo "lastName" debe tener al menos 2 caracteres.');
        }

        if (!birthdate) {
          errors.push('El campo "birthdate" es obligatorio.');
        }

        if (!phoneNumber || !regexPhoneNumber.test(phoneNumber.toString())) {
          errors.push('El campo "phoneNumber" no es válido.');
        }

        if (!city || typeof city !== 'string' || city.length < 2) {
          errors.push('El campo "city" debe tener al menos 2 caracteres.');
        }

        if (!country || typeof country !== 'string' || country.length < 2) {
          errors.push('El campo "country" debe tener al menos 2 caracteres.');
        }

        if (!address || typeof address !== 'string' || address.length < 2) {
          errors.push('El campo "address" debe tener al menos 2 caracteres.');
        }

        if (errors.length > 0) {
          return res.status(400).json({ message: 'Error al crear usuario.', errors });
        }

        else{

            const newUser = await User.create({

                id: id, 
                name: name, 
                lastName: lastName, 
                birthdate: birthdate, 
                phoneNumber: phoneNumber, 
                city: city, 
                country: country, 
                address: address
    
                })
    
            if(!newUser){
    
                return res.status(400).send("No se pudo crear al usuario")
    
            }else{
    
                return res.status(200).json(newUser);
    
            }
        }

        } catch (error) {

            if (error.name === "SequelizeUniqueConstraintError") {

                return res.status(400).json({ message: "La ID ya existe" });

            }

                return res.status(500).json({ message: "Error interno del servidor" });

        }

    };

    const getUsers = async (req, res) => {

        try {

        const users = await User.findAll()

        if(!users){

            return res.status(400).send("No existen usuarios")

        }else{

            return res.status(200).json(users);

        }

        } catch (error) {

            return res.status(400).json({message: error.message})

        }

    };



    module.exports = {
        createUser,
        getUsers,
    };
