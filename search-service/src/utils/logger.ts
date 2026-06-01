import winston from "winston";

export const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",

    defaultMeta: {
        service: "media-service",
    },

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),

    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({
                    format: "HH:mm:ss",
                }),
                winston.format.printf(
                    ({ timestamp, level, message }) =>
                        `[${timestamp}] ${level}: ${message}`
                )
            ),
        }),

        new winston.transports.File({
            filename: "error.log",
            level: "error",
        }),

        new winston.transports.File({
            filename: "combined.log",
        }),
    ],
});