const PDFDocument = require('pdfkit')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

exports.generateInvoiceNumber = async () => {
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    return `FAT-${year}-${timestamp}`
}

exports.calculateInvoiceTotals = (items) => {
    let subtotal = 0
    let totalVat = 0

    const calculatedItems = items.map(item => {
        const itemSubtotal = item.quantity * item.unitPrice
        const vatAmount = (itemSubtotal * item.vatRate) / 100
        const itemTotal = itemSubtotal + vatAmount

        subtotal += itemSubtotal
        totalVat += vatAmount

        return {...item, subtotal: itemSubtotal, vatAmount: vatAmount, total: itemTotal}
    })

    return { items: calculatedItems, subtotal, totalVat, total: subtotal + totalVat}
}

exports.generateInvoicePDF = async (invoice) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 })
            const filename = `invoice-${invoice.invoiceNumber}.pdf`
            const filepath = path.join(__dirname, '../../temp', filename)

            const tempDir = path.dirname(filepath)
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true })}

            doc.pipe(fs.createWriteStream(filepath))    

            const buffer = []
            doc.on('data', buffer.push.bind(buffer))
            doc.on('end', async () => {
                const pdfBuffer = Buffer.concat(buffer)

                await require('../models/Invoice').findByIdAndUpdate(invoice._id, {
                    pdfBuffer: pdfBuffer, pdfContentType: 'application/pdf'
                })
                resolve(filepath)
            })

            doc.fontSize(20).text('FATTURA', { align: 'center' }).moveDown()
            doc.fontSize(12).text('Mia Impresa Ltds', 50 , 120)
                            .text('Via Roma, 123', 50, 135)
                            .text('Milano, Italia', 50, 150)
                            .text('P.IVA: 12345678901', 50, 165)

            doc.text(`Fattura N°: ${invoice.invoiceNumber}`, 350, 120)                
                .text(`Data: ${new Date().toLocaleDateString('it-IT')}`, 350, 135)

            doc.moveDown(3)
            .text('cliente:', 50, 220)    
            .text(invoice.customer.name, 50, 235)
            .text(invoice.customer.email, 50, 250)
            
            if (invoice.customer.address) {
                const addr = invoice.customer.address
                doc.text(`${addr.street}, ${addr.city}, ${addr.zipCode}`, 50 , 265)
            }

            if (invoice.customer.fiscalCode) {
                doc.text(`C.F.: ${invoice.customer.fiscalCode}`, 50, 280)
            }

            let yPosition = 330
            doc.text('Descrizione', 50, yPosition)    
                .text('Quantità', 250, yPosition)
                .text('Costo Unitario', 300, yPosition)
                .text('IVA%', 380, yPosition)
                .text('Totale', 450, yPosition)

            yPosition += 20
            doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke()
            
            // Adicionar os itens da fatura
            yPosition += 15
            if (invoice.items && invoice.items.length > 0) {
                invoice.items.forEach(item => {
                    // Logging para debug
                    console.log('Item da fatura:', JSON.stringify(item));
                    console.log('Produto:', item.product ? JSON.stringify(item.product) : 'Produto não disponível');
                    
                    if (item.product) {
                        const productName = item.product.name || 'Prodotto';
                        doc.text(productName, 50, yPosition)
                            .text(item.quantity.toString(), 250, yPosition)
                            .text(`€${Number(item.unitPrice).toFixed(2)}`, 300, yPosition)
                            .text(`${item.vatRate}%`, 380, yPosition)
                            .text(`€${Number(item.subtotal + item.vatAmount).toFixed(2)}`, 450, yPosition);
                        
                        yPosition += 20;
                    }
                });
            }
            
            // Linha separadora
            doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
            
            yPosition += 15
            doc.text(`Subtotale €${Number(invoice.subtotal).toFixed(2)}`, 350, yPosition)

            yPosition += 15
            doc.text(`IVA: €${Number(invoice.totalVat).toFixed(2)}`, 350, yPosition)

            yPosition += 15
            doc.fontSize(14).text(`TOTALE: €${Number(invoice.total).toFixed(2)}`, 350, yPosition)

            doc.end()

        } catch (error) {
            reject(error)
        }
    })
}
