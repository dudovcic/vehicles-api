import { WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';

export const loggingConfig: WinstonModuleOptions = {
  transports: new transports.Console(),
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss,SSS' }),
    format.errors({ stack: true }),
    format.printf(({ context, level, timestamp, message, ...rest }) =>
      JSON.stringify({
        ...rest,
        className: context,
        logLevel: level,
        logTime: timestamp,
        logMessage: message,
      }),
    ),
  ),
};
