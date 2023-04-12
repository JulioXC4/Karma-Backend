const nodemailer = require ('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
require('dotenv').config();
const {  SENDGRID_API_KEY} = process.env;


const createTrans = () =>{
const transport = nodemailer.createTransport(nodemailerSendgrid({
      apiKey: SENDGRID_API_KEY}));
    return transport;
};
  

const sendMail = async ({ email, subject, templateId }) => {

  const transporter = createTrans()
  const info = await transporter.sendMail({
    from: '"Karma" <karma.contact12@gmail.com>',
    to: email,
    subject: subject,
    templateId: templateId,
  });
  console.log("message send :%s", info.messageId);
  return
};

const sendConfirmationRegistrationEmail = async ({ email }) => {

  await sendMail({
    email: email,
    subject: 'Bienvenido a Karma',
    templateId: 'd-0e8b52137ae34984bce638e224dc8a3b'
  });
};

const sendPaymentConfirmationEmail = async ({ email }) => {
  try {
  await sendMail({
    email: email,
    subject: 'Confirmación de pago en Karma',
    templateId: 'd-1dc54b4002dd45e19dbe746222fe8186'
  });
} catch (error) {
  console.error(`Error al enviar el correo electrónico de confirmación de pago a ${email}: ${error.message}`);
}
}

module.exports = {
  sendMail,
  sendConfirmationRegistrationEmail,
  sendPaymentConfirmationEmail
}
//d-1dc54b4002dd45e19dbe746222fe8186



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
    /*const approvedPaymentMercadoPago = async (req, res) => {

  const {merchant_order_id, collection_status} = req.query
  const merchantData = await getMerchantOrder(merchant_order_id)
  const orderId = parseInt(merchantData.external_reference)

  if(merchantData.status === 'closed' && collection_status === 'approved'){

    cancelTimer(orderId)
    await ChangeOrderStatus(orderId, "Orden Pagada")
    await emptyUserShoppingCart(orderId)
    const email = req.user.email; // correo del usuario logueado
    await sendPaymentConfirmationEmail({ email });
  }
  return res.redirect(`${HOST_FRONT}/profile/orders`);
}*/