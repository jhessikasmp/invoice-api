const express = require('express')
const customerController = require('../controllers/customerController')

const router = express.Router()

router.get('/', customerController.getall)
router.post('/', customerController.create)
router.get('/:id', customerController.getByID)
router.put('/:id', customerController.update)
router.delete('/:id', customerController.delete)

module.exports = router