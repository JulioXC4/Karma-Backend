const { default: axios } = require('axios');
const data = require('../utils/data.json')
const {HOST_BACK} = process.env

//FUNCTIONS
const createInitialData = async () => {

    //CREATE USERS
    await Promise.all(
        data.users.map(async (user) => {
            await axios.post(`${HOST_BACK}/user/createUser`, user)
        })
    )

    //CREATE TABLETS
    await Promise.all(
        data.products[0]["Tablets"].map(async (tablet) => {
            await axios.post(`${HOST_BACK}/tablet/createTablet`, tablet)
        })
    )

    //CREATE LAPTOPS
    await Promise.all(
        data.products[1]["Laptops"].map(async (laptop) => {
            await axios.post(`${HOST_BACK}/laptop/createLaptop`, laptop)
        })
    )
     //CREATE CELLPHONE
 await Promise.all(
    data.products[2]["CellPhone"].map(async (cellphone) => {
        await axios.post(`${HOST_BACK}/cellPhone/createCellPhone`, cellphone)
    })
)

    //CREATE TELEVISORES
    await Promise.all(
        data.products[3]["Televisor"].map(async(tv) =>{
            await axios.post(`${HOST_BACK}/tv/createTelevisor`, tv)
        })
    )
}

module.exports= {createInitialData}