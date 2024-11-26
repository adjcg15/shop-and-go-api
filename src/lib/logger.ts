import { createLogger, format, transports, Logger as WLogger } from "winston";

let winstonLogger: WLogger;

const errorFormat = format.printf(({ level, message, label, timestamp }) => {
    return `[${level}] ${timestamp} ${label}: ${message}`;
});

winstonLogger = createLogger({
    format: format.combine(
        format.timestamp(),
        errorFormat
    ),
    transports: [
        new transports.File({ filename: 'logs.log' }),
    ],
});

const logger = {
    error: function(errorName: string, errorMessage: string) {
        winstonLogger.error({ label: errorName, message: errorMessage });
    },
    waring: function(waringName: string, warningMessage: string) {
        winstonLogger.warn({ label: waringName, message: warningMessage });
    }
};

export default logger;