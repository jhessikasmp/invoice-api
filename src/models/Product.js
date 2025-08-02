const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['prodotto', 'servizio'], required: true },
    unitPrice: { type: Number, required: true },
    unit: { type: String, enum: ['pezzo', 'ora', 'chilogrammo'] ,default: 'pezzo' },
    vatRate: { type: Number, default: 22 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

ProductSchema.pre('save', function(next) {
    this.updatedAt = new Date()
    next()
})

ProductSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() })
    next()
})

module.exports = mongoose.model('Product', ProductSchema)