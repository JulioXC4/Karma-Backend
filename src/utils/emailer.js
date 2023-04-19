const nodemailer = require ('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
require('dotenv').config();
const {  SENDGRID_API_KEY} = process.env;
const htmlTemplate= require ('../Template/htmlTemplate (2).js');
const htmlSending = require('../Template/htmlSending.js');
const htmlDelivered = require('../Template/htmlDelivered.js');
//const fs = require('fs');
//const path = require('path');


const createTrans = () =>{
const transport = nodemailer.createTransport(nodemailerSendgrid({
      apiKey: SENDGRID_API_KEY}));
    return transport;
};
  

const sendMail = async ({ email, subject, html }) => {
  const transporter = createTrans();
  const info = await transporter.sendMail({
    from: '"Karma" <karma.contact12@gmail.com>',
    to: email,
    subject: subject,
    html: html
  });

  const message = `El correo electrónico se ha enviado a ${email}. `;
  console.log(message);
  return;
};



const sendConfirmationRegistrationEmail = async ({ email }) => {
  const subject = 'Bienvenido a Karma';
  const templateId = 'd-0e8b52137ae34984bce638e224dc8a3b';

  const transporter = createTrans();
  const info = await transporter.sendMail({
    from: '"Karma" <karma.contact12@gmail.com>',
    to: email,
    subject: subject,
    templateId: templateId
  });

  const message = `El correo electrónico se ha enviado a ${email}.`;
  console.log(message);
  return;
};
const sendPaymentConfirmationEmail = async ({ email, shoppingCartItems, orderDate,  orderNumber }) => {
  try {
    if (!shoppingCartItems || shoppingCartItems.length === 0) {
      throw new Error("La lista de productos está vacía");
    }

    let productsList = "";
    let totalPrice = 0;

    shoppingCartItems.forEach(item => {
      const product = item.Product;
      const amount = item.amount;
      const itemPrice = product.price * amount;
      totalPrice += itemPrice;

      productsList += `<li>${product.brand} ${product.model} (Cantidad: ${amount}) - Precio: $${itemPrice}</li>`;
    });

    const userName = shoppingCartItems[0].User?.name ?? "Cliente";
    const userEmail = shoppingCartItems[0].User?.email ?? "";
    const currentDate = new Date().toLocaleString();

    const emailData = {
      email: email,
      subject: 'Confirmación de pago en Karma',
      html: htmlTemplate
        .replace('{userName}', userName)
        .replace('{totalPrice}', totalPrice)
        .replace('{orderNumber}', orderNumber)
        .replace('{orderDate}', orderDate)
        .replace('{currentDate}', currentDate)
        .replace('{productsList}', `<ul>${productsList}</ul>`)
    };

    await sendMail(emailData);
  } catch (error) {
    console.error(`Error al enviar el correo electrónico de confirmación de pago a ${email}: ${error.message}`);
  }
};




const  sendConfirmationEmail= async ({ email, shoppingCartItems, orderDate, orderNumber }) => {
  try {
    if (!shoppingCartItems || shoppingCartItems.length === 0) {
      throw new Error("La lista de productos está vacía");
    }

    let productsList = "";
    let totalPrice = 0;

    for (const item of shoppingCartItems) {
      const product = item.Product;
      const amount = item.amount;
      const itemPrice = product.price * amount;
      totalPrice += itemPrice;

      productsList += `<li>${product.brand} ${product.model} (Cantidad: ${amount}) - Precio: $${itemPrice}</li>`;
    }

    const userName = shoppingCartItems[0].User?.name ?? "Cliente";
    const userEmail = shoppingCartItems[0].User?.email ?? "";
    const currentDate = new Date().toLocaleString();

    const emailData = {
      email: email,
      subject: 'Confirmación de pago en Karma',
      html: htmlTemplate
        .replace('{userName}', userName)
        .replace('{totalPrice}', totalPrice)
        .replace('{orderNumber}', orderNumber)
        .replace('{orderDate}', orderDate)
        .replace('{currentDate}', currentDate)
        .replace('{productsList}', `<ul>${productsList}</ul>`)
    };
  

    await sendMail(emailData);
  } catch (error) {
    console.error(`Error al enviar el correo electrónico de confirmación de pago a ${email}: ${error.message}`);
  }
};


const sendingOrder = async ({ email, id }) => {
  try{
    const dataEmail = {
      email: email,
      subject: `Orden  ${ id } Enviada`,
      html: htmlSending.replace('{id}', id)
     
    }; 
  
    await sendMail(dataEmail);
  } catch (error) {
    console.error(`Error al enviar el correo electrónico de confirmación de pago a ${email}: ${error.message}`);
  }
};



const orderDelivered = async ({ email, id }) => {
  try {
      const dataEmail = {
      email: email,
      subject: `Order ${id} Delivered`,
      html: htmlDelivered.replace('{id}', id)
    };

    await sendMail(dataEmail);
  } catch (error) {
    console.error(`Error sending confirmation email to ${email}: ${error.message}`);
  }
};




 
  
module.exports = {
  sendMail,
  sendConfirmationRegistrationEmail,
  sendConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendingOrder,
  orderDelivered
}

//d-1dc54b4002dd45e19dbe746222fe8186



//to:`${newUser.email}`,
//subject: `Hola ${newUser.name}, bienvenido a KARMA`,
//'<b>Gracias por Unirte  a KARMA!!</b>'
 // const transport = nodemailer.createTransport({
       // host: "smtp.mailtrap.io",
        //port: 2525,
        //auth: {
         //   user: "81534248d44b04",
          //  pass: "163536d728e867"
        //}
    //})

  /*const  sendConfirmationEmail = async ({ email, shoppingCartItems, orderDate, orderNumber }) => {
  try {
    const product = shoppingCartItems[0].Product;
    const amount = shoppingCartItems[0].amount;
    const totalPrice = product.price * amount;
    const userName = shoppingCartItems[0].User?.name ?? "Cliente";
    const userEmail = shoppingCartItems[0].User?.email ?? "";
    const currentDate = new Date().toLocaleString();

    await sendMail({
      email: email,
      subject: 'Confirmación de pago en Karma',
      templateId: 'd-15ade0ec075c4576ba95137db5350cea',
      dynamic_template_data: {
        product_name: product.name,
        product_description: product.description,
        product_price: product.price,
        product_quantity: amount,
        total_price: totalPrice,
        user_name: userName,
        user_email: userEmail,
        order_date: orderDate,
        order_number: orderNumber,
        current_date: currentDate
      }
    });
    
  } catch (error) {
    console.error(`Error al enviar el correo electrónico de confirmación de pago a ${email}: ${error.message}`);
  
};*/
