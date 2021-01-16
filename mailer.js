const nodemailer = require('nodemailer');
const juice = require('juice');
const htmlToText = require('html-to-text');
const pug = require('pug');
const util = require('util');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

let transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS
  }
})

const generarHtml = (opciones = {}) => {
  const html = pug.renderFile(`${__dirname}/views/email/${opciones.pagina}.pug`, opciones);
  return juice(html);
}

const enviarEmail = async opciones => {
  const html = generarHtml(opciones);
  const text = htmlToText.fromString(html);
  let emailOpciones = {
    from: 'Galeria de libros <no-reply@galeriadelibros.com>',
    to: opciones.destinatario,
    subject: opciones.asunto,
    text,
    html
  }
  const enviarEmail = util.promisify(transport.sendMail, transport);
	return enviarEmail.call(transport, emailOpciones);
}

module.exports = enviarEmail;