// Tratamento padronizado de erros
class APIError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Wrapper para logs estruturados
const logger = {
  info: (message, data = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...data
    }));
  },
  
  error: (message, error, data = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      error: error.message,
      stack: error.stack,
      ...data
    }));
  }
};

// Middleware para tratamento de erros
const errorHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    logger.error('Request failed', error, { 
      path: req.url,
      method: req.method 
    });

    if (error instanceof APIError) {
      return res.status(error.statusCode).json({
        error: error.message,
        details: error.details
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

module.exports = {
  APIError,
  logger,
  errorHandler
};