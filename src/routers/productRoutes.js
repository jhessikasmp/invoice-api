const express = require('express')
const productController = require('../controllers/productController')

const router = express.Router()

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Ottieni tutti i prodotti
 *     description: Restituisce un elenco di tutti i prodotti e servizi.
 *     tags: [Prodotti]
 *     responses:
 *       200:
 *         description: Lista dei prodotti recuperata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Errore del server
 */
router.get('/', productController.getAll)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuovo prodotto
 *     description: Crea un nuovo prodotto o servizio nel database.
 *     tags: [Prodotti]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Prodotto creato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dati non validi nella richiesta
 *       500:
 *         description: Errore del server
 */
router.post('/', productController.create)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Ottieni un prodotto per ID
 *     description: Restituisce un prodotto specifico in base all'ID fornito.
 *     tags: [Prodotti]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del prodotto
 *     responses:
 *       200:
 *         description: Prodotto recuperato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Prodotto non trovato
 *       500:
 *         description: Errore del server
 */
router.get('/:id', productController.getByID)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Aggiorna un prodotto
 *     description: Aggiorna i dati di un prodotto esistente.
 *     tags: [Prodotti]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del prodotto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Prodotto aggiornato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Prodotto non trovato
 *       400:
 *         description: Dati non validi nella richiesta
 *       500:
 *         description: Errore del server
 */
router.put('/:id', productController.update)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Elimina un prodotto
 *     description: Elimina un prodotto dal database.
 *     tags: [Prodotti]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del prodotto
 *     responses:
 *       200:
 *         description: Prodotto eliminato con successo
 *       404:
 *         description: Prodotto non trovato
 *       500:
 *         description: Errore del server
 */
router.delete('/:id', productController.delete)

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - unitPrice
 *       properties:
 *         name:
 *           type: string
 *           description: Nome del prodotto o servizio
 *           example: Consulenza Web
 *         description:
 *           type: string
 *           description: Descrizione dettagliata
 *           example: Servizio di consulenza per sviluppo web
 *         type:
 *           type: string
 *           enum: [prodotto, servizio]
 *           description: Tipologia (prodotto o servizio)
 *           example: servizio
 *         unitPrice:
 *           type: number
 *           format: float
 *           description: Prezzo unitario
 *           example: 80.00
 *         unit:
 *           type: string
 *           enum: [pezzo, ora, chilogrammo]
 *           description: Unità di misura
 *           example: ora
 *         vatRate:
 *           type: number
 *           description: Aliquota IVA (%)
 *           default: 22
 *           example: 22
 *
 *     Product:
 *       allOf:
 *         - $ref: '#/components/schemas/ProductInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: ID univoco del prodotto
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: Data di creazione
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: Data di ultimo aggiornamento
 */

module.exports = router