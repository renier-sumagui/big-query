import { logger } from "../utils/logger";

const notFound = (req, res, next) => {
    const err: any = {}
    err.statusCode = 404
    err.message = `Invalid request ${req.method} ${req.originalUrl}`
    next(err)
  }
  const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    logger.error(err)
    if (
      err.response &&
      err.response.data &&
      err.response.data.output &&
      err.response.data.output.payload
    ) {
      res.status(err.response.data.output.statusCode).send({
        success: 0,
        response: [],
        message: err.message
      })
    } else if (err.response && err.response.data && err.response.data.message) {
      res.status(err.response.status).send({
        success: 0,
        response: [],
        message: err.message
      })
    } else if (err.output && err.output.payload && err.output.payload.message) {
      res.status(err.output.payload.statusCode).send({
        success: 0,
        response: [],
        message: err.message
      })
    } else {
      res.status(statusCode).send({
        success: 0,
        response: [],
        message: err.message
      })
    }
  }
  
  export { errorHandler as errorHandlerMiddleware, notFound as notFoundMiddleware }