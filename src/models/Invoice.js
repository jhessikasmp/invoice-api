const mongoose = require('mongoose')

const InvoiceItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    vatRate: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    vatAmount: { type: Number, required: true },
    total: { type: Number, required: true }
})

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, unique: true, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [InvoiceItemSchema],
    subtotal: { type: Number, required: true },
    totalVat: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'sent', 'paid'], default: 'draft' },
    emailSent: { type: Boolean, default: false },
    pdfPath: { type: String },
    pdfBuffer: { type: Buffer },
    pdfContentType: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

InvoiceSchema.pre('save', function(next) {
    this.updatedAt = new Date()
    next()
})

module.exports = mongoose.model('Invoice', InvoiceSchema)
