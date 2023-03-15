const { User, Product } = require('../db.js');
const data = require('../utils/data.json')

//FUNCTIONS
const createInitialData = async () => {

    await Promise.all(
        data.users.map(async (user) => {

            await User.create(user)
        })
    )

    await Promise.all(
        data.products.map(async (product) => {

            await Product.create(product)
        })
    )

}

module.exports= {createInitialData}