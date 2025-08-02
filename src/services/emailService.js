const nodemailer = require('nodemailer');
const fs = require('fs');
const logger = require('../logger');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

exports.sendInvoiceEmail = async (customer, invoiceData, pdfPath) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: customer.email,
      subject: `Fattura N° ${invoiceData.invoiceNumber}`,
      html: `
        <h2>Fattura N° ${invoiceData.invoiceNumber}</h2>
        <p>Gentile ${customer.name},</p>
        <p>In allegato troverai la tua fattura.</p>
        <p><strong>Totale: €${invoiceData.total.toFixed(2)}</strong></p>
        <p>Grazie per la tua fiducia!</p>
        <br>
        <p>Cordiali saluti,<br>La Tua Azienda</p>
      `,
      attachments: [
        {
          filename: `fattura-${invoiceData.invoiceNumber}.pdf`,
          content: invoiceData.pdfBuffer && invoiceData.pdfBuffer.length > 0 ? invoiceData.pdfBuffer : 
          fs.createReadStream(pdfPath),
          contentType: 'application/pdf'
        }
      ]
    };
    
    const result = await transporter.sendMail(mailOptions);
    logger.info('Email enviado', { to: customer.email, messageId: result.messageId });
    
    return result;
  } catch (error) {
    logger.error(`Errore nell'invio dell'e-mail`, { 
      error: error.message,
      stack: error.stack,
      customer: customer.email,
      invoice: invoiceData.invoiceNumber
    });
    throw new Error(`Errore nell'invio dell'e-mail: ${error.message}`);
  }
};