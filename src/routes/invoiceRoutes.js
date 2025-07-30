const express = require('express')
const invoiceController = require('../controllers/invoiceController')

const router = express.Router()

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Ottieni tutte le fatture
 *     description: Restituisce un elenco di tutte le fatture.
 *     tags: [Fatture]
 *     responses:
 *       200:
 *         description: Lista delle fatture recuperata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 *       500:
 *         description: Errore del server
 */
router.get('/', invoiceController.getAll)

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Crea una nuova fattura
 *     description: Crea una nuova fattura con calcolo automatico dei totali e IVA.
 *     tags: [Fatture]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceInput'
 *     responses:
 *       201:
 *         description: Fattura creata con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Dati non validi nella richiesta
 *       404:
 *         description: Cliente o prodotto non trovato
 *       500:
 *         description: Errore del server
 */
router.post('/', invoiceController.create)

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Ottieni una fattura per ID
 *     description: Restituisce una fattura specifica in base all'ID fornito.
 *     tags: [Fatture]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID della fattura
 *     responses:
 *       200:
 *         description: Fattura recuperata con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Fattura non trovata
 *       500:
 *         description: Errore del server
 */
router.get('/:id', invoiceController.getById)

/**
 * @swagger
 * /api/invoices/{id}/pdf:
 *   get:
 *     summary: Genera e scarica il PDF della fattura
 *     description: Genera un documento PDF per la fattura e lo restituisce per il download.
 *     tags: [Fatture]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID della fattura
 *     responses:
 *       200:
 *         description: PDF generato con successo
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Fattura non trovata
 *       500:
 *         description: Errore del server
 */
router.get('/:id/pdf', invoiceController.generatePDF)

/**
 * @swagger
 * /api/invoices/{id}/send:
 *   post:
 *     summary: Invia la fattura via email
 *     description: Invia la fattura al cliente tramite email, allegando il PDF.
 *     tags: [Fatture]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID della fattura
 *     responses:
 *       200:
 *         description: Email inviata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fattura inviata via email con successo
 *       400:
 *         description: Cliente senza email registrata
 *       404:
 *         description: Fattura non trovata
 *       500:
 *         description: Errore del server
 */
router.post('/:id/send', invoiceController.sendEmail)

/**
 * @swagger
 * /api/invoices/{id}/status:
 *   patch:
 *     summary: Aggiorna lo stato della fattura
 *     description: Aggiorna lo stato di una fattura (bozza, inviata, pagata).
 *     tags: [Fatture]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID della fattura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, sent, paid]
 *                 description: Nuovo stato della fattura
 *                 example: paid
 *     responses:
 *       200:
 *         description: Stato della fattura aggiornato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Stato non valido
 *       404:
 *         description: Fattura non trovata
 *       500:
 *         description: Errore del server
 */
router.patch('/:id/status', invoiceController.updateStatus)

/**
 * @swagger
 * components:
 *   schemas:
 *     InvoiceItemInput:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           description: ID del prodotto
 *           example: 60d21b4667d0d8992e610c85
 *         quantity:
 *           type: number
 *           description: Quantità
 *           example: 2
 *
 *     InvoiceItem:
 *       type: object
 *       properties:
 *         product:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             unitPrice:
 *               type: number
 *             vatRate:
 *               type: number
 *         quantity:
 *           type: number
 *         unitPrice:
 *           type: number
 *         vatRate:
 *           type: number
 *         subtotal:
 *           type: number
 *         vatAmount:
 *           type: number
 *         total:
 *           type: number
 *
 *     InvoiceInput:
 *       type: object
 *       required:
 *         - customerId
 *         - items
 *       properties:
 *         customerId:
 *           type: string
 *           description: ID del cliente
 *           example: 60d21b4667d0d8992e610c84
 *         items:
 *           type: array
 *           description: Elenco dei prodotti della fattura
 *           items:
 *             $ref: '#/components/schemas/InvoiceItemInput'
 *
 *     Invoice:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID univoco della fattura
 *         invoiceNumber:
 *           type: string
 *           description: Numero della fattura
 *           example: FAT-2025-123456
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InvoiceItem'
 *         subtotal:
 *           type: number
 *           description: Subtotale (senza IVA)
 *           example: 160.00
 *         totalVat:
 *           type: number
 *           description: Totale IVA
 *           example: 35.20
 *         total:
 *           type: number
 *           description: Totale fattura (con IVA)
 *           example: 195.20
 *         status:
 *           type: string
 *           enum: [draft, sent, paid]
 *           description: Stato della fattura
 *           example: draft
 *         emailSent:
 *           type: boolean
 *           description: Flag che indica se la fattura è stata inviata via email
 *           example: false
 *         pdfPath:
 *           type: string
 *           description: Percorso del file PDF
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data di creazione
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data di ultimo aggiornamento
 */

module.exports = router