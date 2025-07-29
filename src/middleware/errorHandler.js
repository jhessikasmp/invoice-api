const logger = require('../logger');

module.exports = (err, req, res, next) => {
  logger.error('Errore nell`applicazione', { error: err.message, stack: err.stack });
  
  if (!res.headersSent) {
    res.status(500).json({ error: 'Errore interno del server' });
  }
};
