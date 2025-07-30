const express = require("express")
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const customerRoutes = require('./routes/customerRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const productRoutes = require('./routes/productRoutes')
const errorHandler = require('./middlewares/errorHandler')

dotenv.config()

const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('MongoDB connesso'))
.catch(err => console.error('Errore MongoDB', err))

const swaggerSpec = swaggerJsdoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Sistema de Fattura',
            version: '1.0.0',
            description: 'Sistema di emissione di note fiscali semplificate'}
    },
    apis: ['./src/routes/*.js']
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api/customers', customerRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/products', productRoutes)
app.use('/', (req, res) => {
    res.send('API Sistema de Fattura sta funzionando')
})

app.use(errorHandler)

module.exports = app