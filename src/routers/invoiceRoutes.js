const express = require('express')
const invoiceController = require('../controllers/invoiceController')

const router = express.Router()

router.get('/', invoiceController.getAll)
router.post('/', invoiceController.create)
router.get('/:id', invoiceController.getById)
router.get('/:id/pdf', invoiceController.generatePDF)
router.post('/:id/send', invoiceController.sendEmail)
router.patch('/:id/status', invoiceController.updateStatus)

module.exports = router