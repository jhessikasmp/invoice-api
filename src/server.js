const app = require('./app')
const logger = require('./logger')

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    logger.info(`Server avviato sulla porta ${PORT}`)
    console.log(`Server avviato sulla porta ${PORT}`)
    console.log(`Documentazione: http://localhost:${PORT}/api-docs`)
})
