
//REGEXS

const regexPhoneNumber = /^\+\d{1,2}\s?\d{1,15}$/
//const regexPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{1,4}$/

const PromoProducts = (arr,quantity) =>{
    let copyArr = [...arr]
    let select = []
    while (quantity > 0 && copyArr.length > 0) {
        const indexRandom = Math.floor(Math.random() * copyArr.length)
        const objetSelect = copyArr[indexRandom]
        select.push(objetSelect)
        copyArr.splice(indexRandom,1)
        quantity--;
    }

    return select
}

module.exports= {regexPhoneNumber, PromoProducts}