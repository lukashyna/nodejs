require('dotenv').config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function main(email,verificationToken) {
  const [response] = await sgMail.send({
    to: email,
    from: 'anastasiia.lukashyna@gmail.com',
    subject: "Verification",
    html: `<strong>Перейдите по ссылке для верификации аккаунта http://localhost:3000/auth/verify/:${verificationToken}</strong>`,
  });

  console.log(response);
}
module.exports = {
    main
}
