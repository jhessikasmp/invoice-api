const Product = require('../models/Product')
const logger = require('../logger')

exports.getAll = async (req, res, next) => {
    try {
        const product = await Product.find()
        res.status(201).json(product)
    } catch (err) {
        next(err)
    }
}

exports.getByID = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product) {
            return res.status(404).json({ error: 'Prodotto non trovato nel sistema' })}

        res.status(201).json(product)
    } catch (err) {
        next(err)
    }
}

exports.create = async (req, res, next) => {
    try {
        const product = await Product.create(req.body)
        logger.info('Nuovo prodotto registrato nel sistema', { product: product.name })
        res.status(201).json(product)
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body,
            { new: true, runValidators: true })

        if(!product) {
            return res.status(404).json({ error: 'Prodotto non trovato nel sistema' })}

        logger.info('Prodotto aggiornato con successo', { product: product.name })
        res.status(201).json(product)
    } catch (err) {
        next(err)
    }
}

exports.delete = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        
        if(!product) {
            return res.status(404).json({ error: 'Prodotto non trovato nel sistema' })}

        logger.info('Prodotto eliminato dal sistema', { id: req.params.id })
        res.status(200).json({ message: 'Prodotto rimosso con successo' })
    } catch (err) {
        
    }
}