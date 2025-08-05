const nodemailer = require('nodemailer')
const fs = require('fs')
const logger = require('../logger')

const createTranspoter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        sucere: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
}

exports.sendInvoiceEmail = async (customer, invoiceData, pdfPath) => {
    try {
        const transporter = createTranspoter()
        const mailOption = {
            from: process.env.EMAIL_FROM,
            to: customer.email,
            subjecy: `Fattura N ${invoiceData.invoiceNumber}`,
            html:`
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
                    fs.createWriteStream(pdfPath),
                    contentType: 'application/pdf'
                }
            ]
        }

        const result = await transporter.sendMail(sendMail)
        logger.info('Emnail enviado', { to: customer.email, messageId: result.messageId })
        return result
    } catch (error) {
        logger.error('erro ao envia o email', { error: error.message, stack: error.stack, customer: customer.email, invoice: invoiceData.invoiceNumber })
    }
    throw new Error('Erro ao envia o email', error.message)
}