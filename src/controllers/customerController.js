const Customer = require('../models/Customer')
const logger = require('../logger')

exports.getall = async (req, res, next) => {
    try {
     const customer = await Customer.find()
     res.status(201).json(customer)   
    } catch (err) {
        next(err)
    } 
}

exports.getByID = async (req, res, next) => {
    try {
       const customer = await Customer.findById(re.parames.id)

    if(!customer) {
        return res.status(404).json({ error: 'Il cliente richiesto non è stato trovato' })}

    res.status(201).json(customer) 
    } catch (err) {
        next(err)
    }
    
}

exports.create = async (req, res, next) => {
    try {
        const customer = await Customer.create(req.body)
        logger.info('Nuovo cliente registrato nel sistema', { customer: customer.name })
        res.status(201).json(customer)
    } catch (err) {
        next(err)
    }
}

exports.update = async (req, res, next) => {
    try {
      const customer = await Customer.findByIdAndUpdate(req.params.id, req.body,
        { new: true, runValidators: true })

    if(!customer) {
        return res.status(404).json({ error: 'Il cliente richiesto non è stato trovato' })}

    logger.info('Aggiornamento del cliente completato', { customer: customer.name })
    res.status(201).json(customer)  
    } catch (err) {
      next(err)  
    }
}

exports.delete = async (req, res, next) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id)
        
    if(!customer) {
        return res.status(404).json({ error: 'Il cliente richiesto non è stato trovato' })}

    logger.info('Cliente eliminato dal sistema', {id: req.params.id })
    res.status(201).json({ message: 'Cliente eliminato dal sistema' }) 
    } catch (err) {
        next(err)
    }
}