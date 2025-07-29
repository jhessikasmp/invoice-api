const express = require('express')
const customerController = require('../controllers/customerController')

const router = express.Router()

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Ottieni tutti i clienti
 *     description: Restituisce un elenco di tutti i clienti.
 *     tags: [Clienti]
 *     responses:
 *       200:
 *         description: Lista dei clienti recuperata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Errore del server
 */
router.get('/', customerController.getall)

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Crea un nuovo cliente
 *     description: Crea un nuovo cliente nel database.
 *     tags: [Clienti]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerInput'
 *     responses:
 *       201:
 *         description: Cliente creato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Dati non validi nella richiesta
 *       500:
 *         description: Errore del server
 */
router.post('/', customerController.create)

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Ottieni un cliente per ID
 *     description: Restituisce un cliente specifico in base all'ID fornito.
 *     tags: [Clienti]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente recuperato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Cliente non trovato
 *       500:
 *         description: Errore del server
 */
router.get('/:id', customerController.getByID)

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Aggiorna un cliente
 *     description: Aggiorna i dati di un cliente esistente.
 *     tags: [Clienti]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerInput'
 *     responses:
 *       200:
 *         description: Cliente aggiornato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Cliente non trovato
 *       400:
 *         description: Dati non validi nella richiesta
 *       500:
 *         description: Errore del server
 */
router.put('/:id', customerController.update)

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Elimina un cliente
 *     description: Elimina un cliente dal database.
 *     tags: [Clienti]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminato con successo
 *       404:
 *         description: Cliente non trovato
 *       500:
 *         description: Errore del server
 */
router.delete('/:id', customerController.delete)

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           description: Via e numero civico
 *           example: Via Roma, 123
 *         city:
 *           type: string
 *           description: Città
 *           example: Milano
 *         zipCode:
 *           type: string
 *           description: Codice postale
 *           example: 20121
 *
 *     CustomerInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: Nome del cliente
 *           example: Francesco Rossi
 *         email:
 *           type: string
 *           format: email
 *           description: Email del cliente
 *           example: francesco.rossi@email.com
 *         phone:
 *           type: string
 *           description: Numero di telefono
 *           example: +39 02 1234567
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         fiscalCode:
 *           type: string
 *           description: Codice fiscale
 *           example: RSSFNC80A01H501X
 *
 *     Customer:
 *       allOf:
 *         - $ref: '#/components/schemas/CustomerInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: ID univoco del cliente
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