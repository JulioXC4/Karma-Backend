const {Laptop, Product} = require('../../db.js');

    const createLaptop = async (req, res) => {

        try {

        const { model, brand, description, price, images, stock, ramMemory, internalMemory, processor } = req.body

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

        if (!images ) {
            errors.push('El campo "images" debe ser un arreglo y debe contener como minimo un elemento.');
        }

        if (!stock || typeof stock !== 'number' || stock <= 0 ) {
            errors.push('El campo "stock" no es válido.');
        }

        if (!ramMemory || typeof ramMemory !== 'string' || ramMemory.length < 2) {
            errors.push('El campo "ramMemory" debe tener al menos 2 caracteres.');
        }
  
        if (!internalMemory || typeof internalMemory !== 'string' || internalMemory.length < 2) {
            errors.push('El campo "internalMemory" debe tener al menos 2 caracteres.');
        }

        if (!processor || typeof processor !== 'string' || processor.length < 2) {
            errors.push('El campo "processor" debe tener al menos 2 caracteres.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Error al crear la laptop.', errors });
        }

        else{

            const newLaptop = await Laptop.create({

                name: `${brand} ${model}`,
                ramMemory: ramMemory, 
                internalMemory: internalMemory, 
                processor: processor
    
                })
    
            if(!newLaptop){
    
                return res.status(400).send("No se pudo crear la laptop")
    
            }else{
    
                const newProduct = await Product.create({

                    model: model, 
                    brand: brand,
                    description: description, 
                    price: price, 
                    images: images,
                    stock: stock

                })

                await newProduct.setLaptop(newLaptop)

                return res.status(200).send("Laptop creada y agregada a productos satisfactoriamente!");
    
            }
        }

        } catch (error) {

            return res.status(500).json({ message: "Error interno del servidor" });

        }

    };

    const updateLaptop = async (req, res) => {

        try {

        const { id, model, brand, description, price, images, stock, name, ramMemory, internalMemory, processor } = req.body

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

        if (!images ) {
            errors.push('El campo "image" debe ser un arreglo y debe contener como minimo un elemento.');
        }

        if (!stock || typeof stock !== 'number' || stock <= 0 ) {
            errors.push('El campo "stock" no es válido.');
        }

        if (!ramMemory || typeof ramMemory !== 'string' || ramMemory.length < 2) {
            errors.push('El campo "ramMemory" debe tener al menos 2 caracteres.');
        }
  
        if (!internalMemory || typeof internalMemory !== 'string' || internalMemory.length < 2) {
            errors.push('El campo "internalMemory" debe tener al menos 2 caracteres.');
        }

        if (!processor || typeof processor !== 'string' || processor.length < 2) {
            errors.push('El campo "processor" debe tener al menos 2 caracteres.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Error al crear la laptop.', errors });
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
                    images: images,
                    stock: stock
    
                })
                await product.save()

                const productLaptop = await product.getLaptop()
                const laptopId = productLaptop.dataValues.id
                
                const laptop = await Laptop.findByPk(laptopId) 
    
                await laptop.update({

                    name,
                    ramMemory: ramMemory, 
                    internalMemory: internalMemory, 
                    processor: processor
        
                    })
                await laptop.save()

                return res.status(200).send("Laptop actualiza satisfactoriamente!");
    
            }
        }

        } catch (error) {

            return res.status(500).json({ message: "Error interno del servidor" });

        }

    };


    module.exports = {
        createLaptop,
        updateLaptop
    };
