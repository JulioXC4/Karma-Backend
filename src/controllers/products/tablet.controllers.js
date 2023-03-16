const {Tablet, Product} = require('../../db.js');

    const createTablet = async (req, res) => {

        try {

        const { model, brand, description, price, image, ramMemory, internalMemory, color, mainCamera, screenSize } = req.body

        const errors = [];

        if (!model || typeof model !== 'string' || model.length < 2) {
            errors.push('El campo "model" debe tener al menos 2 caracteres.');
        }

        if (!brand || typeof brand !== 'string' || brand.length < 2) {
            errors.push('El campo "brand" debe tener al menos 2 caracteres.');
        }
        
        if (!description || typeof description !== 'string' || description.length < 5) {
            errors.push('El campo "description" debe tener al menos 2 caracteres.');
        }

        if (!price || typeof price !== 'number' ) {
            errors.push('El campo "price" no es válido.');
        }

        if (!image || typeof image !== 'string' || image.length < 5) {
            errors.push('El campo "image" debe tener al menos 2 caracteres.');
        }

        if (!ramMemory || typeof ramMemory !== 'string' || ramMemory.length < 2) {
            errors.push('El campo "ramMemory" debe tener al menos 2 caracteres.');
        }
  
        if (!internalMemory || typeof internalMemory !== 'string' || internalMemory.length < 2) {
            errors.push('El campo "internalMemory" debe tener al menos 2 caracteres.');
        }

        if (!color || typeof color !== 'string' || color.length < 2) {
            errors.push('El campo "color" debe tener al menos 2 caracteres.');
        }

        if (!mainCamera || typeof mainCamera !== 'string' || mainCamera.length < 2) {
            errors.push('El campo "mainCamera" debe tener al menos 2 caracteres.');
        }

        if (!screenSize || typeof screenSize !== 'string' || screenSize.length < 2) {
            errors.push('El campo "screenSize" debe tener al menos 2 caracteres.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Error en los parametros al crear la tablet.', errors });
        }

        else{

            const newTablet = await Tablet.create({

                ramMemory: ramMemory, 
                internalMemory: internalMemory, 
                color: color, 
                mainCamera: mainCamera, 
                screenSize: screenSize
    
                })
    
            if(!newTablet){
    
                return res.status(400).send("No se pudo crear la tablet")
    
            }else{
    
                const newProduct = await Product.create({

                    model: model, 
                    brand: brand,
                    description: description, 
                    price: price, 
                    image: image

                })

                await newProduct.setTablet(newTablet)

                return res.status(200).send("Tablet creada y agregada a productos satisfactoriamente!");
    
            }
        }

        } catch (error) {

            return res.status(500).json({ message: "Error interno del servidor" });

        }

    };

    const updateTablet = async (req, res) => {

        try {

        const { id, model, brand, description, price, image, ramMemory, internalMemory, color, mainCamera, screenSize } = req.body

        const errors = [];

        if (!model || typeof model !== 'string' || model.length < 2) {
            errors.push('El campo "model" debe tener al menos 2 caracteres.');
        }

        if (!brand || typeof brand !== 'string' || brand.length < 2) {
            errors.push('El campo "brand" debe tener al menos 2 caracteres.');
        }
        
        if (!description || typeof description !== 'string' || description.length < 5) {
            errors.push('El campo "description" debe tener al menos 2 caracteres.');
        }

        if (!price || typeof price !== 'number' ) {
            errors.push('El campo "price" no es válido.');
        }

        if (!image || typeof image !== 'string' || image.length < 5) {
            errors.push('El campo "image" debe tener al menos 2 caracteres.');
        }

        if (!ramMemory || typeof ramMemory !== 'string' || ramMemory.length < 2) {
            errors.push('El campo "ramMemory" debe tener al menos 2 caracteres.');
        }
  
        if (!internalMemory || typeof internalMemory !== 'string' || internalMemory.length < 2) {
            errors.push('El campo "internalMemory" debe tener al menos 2 caracteres.');
        }

        if (!color || typeof color !== 'string' || color.length < 2) {
            errors.push('El campo "color" debe tener al menos 2 caracteres.');
        }

        if (!mainCamera || typeof mainCamera !== 'string' || mainCamera.length < 2) {
            errors.push('El campo "mainCamera" debe tener al menos 2 caracteres.');
        }

        if (!screenSize || typeof screenSize !== 'string' || screenSize.length < 2) {
            errors.push('El campo "screenSize" debe tener al menos 2 caracteres.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Error en los parametros de la tablet.', errors });
        }

        else{

            const product = await Product.findByPk(id)

            if(!product){
    
                return res.status(400).send(`No se encontro el producto con la id ${id}`)
    
            }else{

                await product.update({

                    model: model, 
                    brand: brand,
                    description: description, 
                    price: price, 
                    image: image
    
                })
                await product.save()

                const productTablet = await product.getTablet()
                const tabletId = productTablet.dataValues.id
                
                const tablet = await Tablet.findByPk(tabletId) 
    
                await tablet.update({

                    ramMemory: ramMemory, 
                    internalMemory: internalMemory, 
                    color: color, 
                    mainCamera: mainCamera, 
                    screenSize: screenSize
        
                    })
                await tablet.save()

                return res.status(200).send("Tablet actualiza satisfactoriamente!");
    
            }
        }

        } catch (error) {

            return res.status(500).json({ message: "Error interno del servidor" });

        }

    };


    module.exports = {
        createTablet,
        updateTablet
    };
