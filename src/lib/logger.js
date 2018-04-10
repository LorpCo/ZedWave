import winston, { createLogger, format, transports } from 'winston'

winston.addColors({
  info: 'bold yellow'
})

const { combine, timestamp, splat, simple, colorize, printf } = format
// Define your custom format with printf.
const myFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`
})

const logger = new createLogger({
  format: combine(
    timestamp(),
    colorize(),
    splat(),
    simple(),
    myFormat
  ),
  transports: [ new transports.Console() ]
})

export default logger
