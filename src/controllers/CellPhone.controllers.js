
const {CellPhone, Product} = require('../db.js');



    const createCellPhone = async (req, res) => {
        try {
          const { model, brand, description, price, images, stock, ramMemory, internalMemory, mainCamera, colors } = req.body;
          const newCellPhone = await CellPhone.create({ 
            name: `${brand} ${model}`,
            ramMemory,
            internalMemory,
            mainCamera,
            colors
          });
      
          const newProduct = await Product.create({
            model, 
            brand,
            description, 
            price, 
            images,
            stock
          });
          
          await newCellPhone.setProduct(newProduct);
          return res.json("registrado correctamente");

        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Hubo un problema al crear el teléfono celular o el producto' });
        }
      };
      
    
      const updateCellPhone = async(req,res) =>{
        try {
    
            const { id,model, brand, description, price, images, name, ramMemory, internalMemory, mainCamera, colors } = req.body;
            
            const product = await Product.findByPk(id)
    
            if(!product){
                return res.status(400).send(`No se encontro el producto con la id ${idProduct}`)
    
            }else{
                await product.update({
    
                    model,
                    brand,
                    description, 
                    price, 
                    images, 
                    stock
    
                })
                await product.save();
    
                const productCellPhone = await product.getCellPhone();
                if (!productCellPhone) {
                    return res.status(400).send(`El producto con la id ${id} no tiene un celular asociado`);
                }
    
                const cellPhoneId = productCellPhone.dataValues.id
    
                const cellphone = await CellPhone.findByPk(cellPhoneId)
                await cellphone.update({
                    name: `${brand} ${model}`,
                    ramMemory:ramMemory,
                    internalMemory:internalMemory,
                    mainCamera:mainCamera,
                    colors:colors
                })
                await   cellphone.save()
                return res.status(200).send("Modificado con exito");
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
    

module.exports = {
    createCellPhone,
    updateCellPhone,

}
//const allowedColors = ['white', 'black', 'violet', 'blue'];
   // if (!allowedColors.includes(color)) {
        //return res.status(400).json({ message: 'El color no es válido' });
        /* if (!name || name.length < 2 || name.length > 50) {
            return res.status(400).json({ message: 'El nombre debe tener entre 2 y 50 caracteres' });
          }
          if (isNaN(ram) || ram <= 0 || isNaN(internalMemory) || internalMemory <= 0 || isNaN(mainCamera) || mainCamera <= 0) {
            return res.status(400).json({ message: 'Los valores de RAM, memoria interna y cámara principal deben ser números positivos' });
          }*/