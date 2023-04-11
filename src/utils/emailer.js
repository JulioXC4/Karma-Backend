const nodemailer = require ('nodemailer');
//const htmlTemplate = require('../Template/htmlTemplate.js');
const nodemailerSendgrid = require('nodemailer-sendgrid');
require('dotenv').config();
const {  SENDGRID_API_KEY} = process.env;


const createTrans = () =>{

    const transport = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: SENDGRID_API_KEY,
    })
    );
    return transport;
};
  

const sendMail = async ({email}) => {
    const transporter =  createTrans()
    const info = await transporter.sendMail({
        from:'"Karma" <karma.contact12@gmail.com>',
          to:`${email}`,
        subject:`Hola !  Bienvenido a KARMA`,
        templateId: 'd-0e8b52137ae34984bce638e224dc8a3b',
    });
    console.log("message send :%s", info.messageId);
    return
}

exports.sendMail= sendMail




/*to:`${newUser.email}`,
subject: `Hola ${newUser.name}, bienvenido a KARMA`,
'<b>Gracias por Unirte  a KARMA!!</b>'*/
 // const transport = nodemailer.createTransport({
       // host: "smtp.mailtrap.io",
        //port: 2525,
        //auth: {
         //   user: "81534248d44b04",
          //  pass: "163536d728e867"
        //}
    //});