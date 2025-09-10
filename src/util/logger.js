const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app.log", level: "info"}),
    new transports.File({ filename: "error.log", level: "error"}),
    new transports.File({ filename: "test.log", level: "debug"})
  ],
});


function loggerMiddleware(req, res, next){
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
}

module.exports = {
  logger,
  loggerMiddleware
}