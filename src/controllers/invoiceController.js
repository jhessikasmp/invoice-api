const Invoice = require('../models/Invoice')
const Product = require('../models/Product')
const Customer = require('../models/Customer')
const { generateInvoiceNumber, calculateInvoiceTotals, generateInvoicePDF } = require('../services/invoiceService')
const { sendInvoiceEmail } = require('../services/emailService')
const logger = require('../logger')
const fs = require('fs')

exports.getAll = async (req, res, next) => {
    try {
        const invoices = await Invoice.find()
        .populate('customer', 'name email')
        .populate('items.product', 'name type')
        .sort({ createdAt: -1 })
        res.json(invoices)
    } catch (err) {
        next(err)
    }
}

exports.getById = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
        .populate('customer')
        .populate('items.product')
        if (!invoice) {
            return res.status(404).json({ error: 'La fattura non è stata trovata' })
        }
         res.json(invoice)
    } catch (err) {
        next(err)
    }
}

exports.create = async (req, res, next) => {
    try {
        const { customerId, items } = req.body

        const customer = await Customer.findById(customerId)
        if (!customer) {
            return res.status(400).json({ error: 'Cliente non trovato' })
        }

        const productData = await Product.find({ _id: { $in: items.map(item => item.productId) } })
        const enrichedItems = items.map(item => {
            const product = productData.find(p => p._id.toString() === item.productId)
        if(!product) {
            throw new Error(`Prodotto ${item.productId} non trovato`)
        }

        return {
            product: product._id, quantity: item.quantity, unitPrice: product.unitPrice, vatRate: product.vatRate
        }
        })

        const calculations = calculateInvoiceTotals(enrichedItems)
        const invoiceNumber = await generateInvoiceNumber()
        const invoice = await Invoice.create({
            invoiceNumber,
            customer: customerId,
            items: calculations.items,
            subtotal: calculations.subtotal,
            totalVat: calculations.totalVat,
            total: calculations.total
        })

        const populatedInvoice = await Invoice.findById(invoice._id)
        .populate('customer')
        .populate('items.product')

        logger.info('Fattura creata', { invoiceNumber, customer: customerId })
        res.status(201).json(populatedInvoice)
    } catch (err) {
        next(err)
    }
}

exports.generatePDF = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
        .populate('customer')
        .populate('items.product')

        if(!invoice) {
            return res.status(404).json({ error: 'La fattura non è stata trovata' })
        }

        if(invoice.pdfBuffer && invoice.pdfBuffer.length > 0) {
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=fattura-${invoice.invoiceNumber}.pdf`,
                'Content-Length': invoice.pdfBuffer.length
            })
            return res.send(invoice.pdfBuffer)
        }

        try {
            console.log('Elementi prima del populate aggiuntivo:', JSON.stringify(invoice.items));
            
            await invoice.populate({
                path: 'items.product',
                select: 'name type description unitPrice vatRate'
            });
            
            console.log('Elementi prima del populate aggiuntivo:', JSON.stringify(invoice.items));
        } catch (populateError) {
            console.error('Errore ai prodotti popolati:', populateError);
        }

        const pdfPath = await generateInvoicePDF(invoice)
        await Invoice.findByIdAndUpdate(req.params.id, { pdfPath })
        res.download(pdfPath, `fattura-${invoice.invoiceNumber}.pdf`, (err) => {
            if(err) {
                logger.error('Errore durante il download del PDF', { error: err.message })
                next(err)
            }
        })
    } catch (err) {
        next(err)
    }
}

exports.sendEmail = async (req,res,next) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
        .populate('customer')
        .populate('items.product')

        if(!invoice) {
            return res.status(404).json({ error: 'La fattura non è stata trovata' })
        }

        if(!invoice.customer || !invoice.customer.email) {
            return res.status(404).json({ error: 'Il cliente non ha un email registrato' })
        }

        let pdfPath = invoice.pdfPath
        let pdfBuffer = invoice.pdfBuffer

        if((!pdfBuffer || pdfBuffer.length === 0) && (!pdfPath || !fs.existsSync(pdfPath))) {
            try {
                pdfPath = await generateInvoicePDF(invoice)
                await Invoice.findByIdAndUpdate(req.params.id, { pdfPath })
                invoice = await Invoice.findById(req.params.id)
                pdfBuffer = invoice.pdfBuffer
            } catch (pdfError) {
                logger.error('Errore durante la generazione del PDF', { error: pdfError.message, invoiceId: req.params.id })
                return res.status(500).json({ error: 'Errore nella generazione del PDF della fattura' })
            }
        }

        try {
            await sendInvoiceEmail(invoice.customer, invoice, pdfPath)
            await Invoice.findByIdAndUpdate(req.params.id, {
                emailSent: true,
                status: 'sent'
            })

            logger.info('Fattura inviata via email', {
                invoiceNumber: invoice.invoiceNumber,
                customerEmail: invoice.customer.email
            })

            res.json({ message: 'Fattura inviata via email con successo' })
        } catch (emailError) {
            logger.error(`Errore durante l'invio dell'email`, {
                error: emailError.message,
                invoiceId: req.params.id,
                customerEmail: invoice.customer.email
            })
            res.status(500).json({ error: `Errore durante l'invio dell'email: ${emailError.message}` })
        }
    } catch (err) {
        logger.error(`Errore nell'elaborazione dell'invio della fattura`, { error: err.message, invoiceId: req.params.id })
        next(err)
    }
}

exports.updateStatus = async (req,res,next) => {
    try {
        const { status } = req.body
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status }, { new: true }
        ).populate('customer', 'name email')

        if(!invoice) {
            return res.status(404).json({ error: 'La fattura non è stata trovata' })
        }

        logger.info('Stato della fattura aggiornato', { invoiceNumber: invoice.invoiceNumber, status })
        res.json(invoice)
    } catch (err) {
        next(err)
    }
}