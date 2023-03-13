import winston, {format} from "winston";
import {DefaultLogger} from "binance";

const today = new Date()
const filename = today.toISOString().split('T')[0] + '.log';
const customFormat = format.combine(
  format.timestamp(),
  format.prettyPrint(),
  format.colorize(),
  format.align(),
  format.printf(info => `Date: ${info.timestamp} ### ${info.message}`)
)

function Logger() {
  return ({
    kucoin: winston.createLogger({
      level: winston.config.syslog.levels,
      format: winston.format.json(),
      transports: [new winston.transports.File({
        filename: `logs/kucoin/${filename}`,
        // format: customFormat,
      })],
    }),
    binance: winston.createLogger({
      level: winston.config.syslog.levels,
      format: winston.format.json(),
      transports: [new winston.transports.File({
        filename: `logs/binance/${filename}`,
        // format: customFormat
      })],
    }),
    transaction: winston.createLogger({
      level: winston.config.syslog.levels,
      format: winston.format.json(),
      transports: [new winston.transports.File({
        filename: `logs/transaction/${filename}`,
        // format: customFormat
      })],
    }),
    binanceTesting: winston.createLogger({
      levels: winston.config.syslog.levels,
      format: winston.format.json(),
      transports: [new winston.transports.File({
        filename: `logs/debugging/binance/${filename}`,
        format: customFormat
      })],
    }),
    kucoinTesting: winston.createLogger({
      levels: winston.config.syslog.levels,
      format: winston.format.json(),
      transports: [new winston.transports.File({
        filename: `logs/debugging/kucoin/${filename}`,
        format: customFormat
      })],
    }),
    kucoinError: winston.createLogger({
      levels: winston.config.syslog.levels,
      format: winston.format.json(),
      transports: [new winston.transports.File({
        filename: `logs/errors/kucoin/${filename}`,
        format: customFormat
      })],
    }),
    binanceError: winston.createLogger({
      levels: winston.config.syslog.levels,
      format: winston.format.json(),
      transports: [new winston.transports.File({
        filename: `logs/errors/binance/${filename}`,
        format: customFormat
      })],
    }),
  })
}

export const socketLogger = {
  ...DefaultLogger,
  silly: (...params) => {
    // console.log(params);
  }
}

export default Logger()
