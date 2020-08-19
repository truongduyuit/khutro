const  winston = require('winston')
const DailyRotateFile = require('winston-daily-rotate-file')

const isDev = process.env.NODE_ENV === 'development'

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'khutro-api' },
  transports: [
    new DailyRotateFile({
        level: 'info',
        filename: 'khutro-api-%DATE%.log',
        maxSize: '20m',
        maxFiles: '30d',
        dirname: 'logs'
    }),
    new DailyRotateFile({
        level: 'error',
        filename: 'error-%DATE%.log',
        maxSize: '20m',
        maxFiles: '20d',
        dirname: 'logs/errors'
    })
  ]
});

//
// If we're not in production then *ALSO* log to the console
// with the colorized simple format.
//
// if (process.env.NODE_ENV !== 'production') {

const prettyFormat = winston.format.printf(({ level, message, label, timestamp, stack }) => {
  return `[${timestamp}] ${label ? `${label}` : ''}| [${level}]: ${message && message} ${
    stack && isDev ? JSON.stringify(stack, null, 2) : ''
  }`
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true }), prettyFormat)
    })
  )
}

module.exports = logger