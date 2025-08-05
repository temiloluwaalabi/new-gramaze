import pino from 'pino';

const isEdge = process.env.NEXT_RUNTIME === 'edge';
const isProduction = process.env.NODE_ENV === 'production';

const isServerSide = typeof window === 'undefined';

const logger = isServerSide
  ? pino(
      !isEdge && !isProduction
        ? {
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                ignore: 'pid,hostname',
                translateTime: 'SYS:standard',
              },
            },
            level: process.env.LOG_LEVEL || 'info',
            formatters: {
              level: (label) => ({ level: label.toUpperCase() }),
            },
            serializers: {
              error: pino.stdSerializers.err,
            },
            timestamp: pino.stdTimeFunctions.isoTime,
          }
        : {
            level: process.env.LOG_LEVEL || 'info',
            formatters: {
              level: (label) => ({ level: label.toUpperCase() }),
            },
            serializers: {
              error: pino.stdSerializers.err,
            },
            timestamp: pino.stdTimeFunctions.isoTime,
          }
    )
  : console;

export default logger;
