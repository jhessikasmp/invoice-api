const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    adress: { street: String, city: String, zipCode: String, country: { type: String, default: 'Italia'} },
    fiscalCode: { type: String },
    vatNumber: { type: String },
    createdAt: { type: Date, default: Date.now() },
    updatedAt : { type: Date, default: Date.now() }
})

CustomerSchema.pre('save', function(next) {
    this.updatedAt = new Date()
    next()
})

CustomerSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() })
    next()
})

module.exports = mongoose.model('Customer', CustomerSchema)