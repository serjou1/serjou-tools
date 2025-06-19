import moment from 'moment-timezone';
import winston, { format } from "winston";

const { combine, printf } = format;
const logFileName = `${moment().tz('Europe/Kyiv').format('MM-DD-HH-mm-ss')}`;
const logFormat = printf(({ level, message, label, metadata }) => {
    return `${moment().tz('Europe/Kyiv').format('HH:mm:ss.SSS')} [${level}]${label ? ` [${label}]` : ''}${(metadata && metadata.place) ? ` [${metadata.place}]` : ''}: ${typeof message === 'bigint' ? message.toString() :
        typeof message === 'string' ? message :
            JSON.stringify(message, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2)
        }`;
});

export class BotLogger {
    private logger: winston.Logger;
    constructor(
        private labels: string[] = [],
        level: string = 'debug',
        skipConsole = false
    ) {
        const transports: winston.transport | winston.transport[] = [
            new winston.transports.File({
                filename: `./logs/${logFileName}.log`
            })
        ];
        if (skipConsole === false) {
            transports.push(new winston.transports.Console());
        }

        const label = this.labels.join(' | ');
        this.logger = winston.createLogger({
            level,
            format: combine(
                format.metadata(),
                format.label({ label }),
                logFormat
            ),
            transports
        })
    }

    public debug(message: any) {
        const e = new Error();

        const regex = /\(?(.*):(\d+):(\d+)\)?$/
        const match = regex.exec((e.stack as string).split("\n")[2]) as RegExpExecArray;

        const place = match[1].split('/').reverse()[0] + ':' + match[2];

        this.logger.debug(message, { place });
    }

    public info(message: any) {
        this.logger.info(message);
    }

    public warning(message: any) {
        this.logger.warn(message);
    }

    public error(message: any, error?: any) {
        const e = new Error();

        const regex = /\((.*):(\d+):(\d+)\)$/
        const match = regex.exec((e.stack as string).split("\n")[2]) as RegExpExecArray;

        const place = match ? (match[1].split('/').reverse()[0] + ':' + match[2]) : 'unknown place';

        if (error) {
            this.logger.error(message, { place });
        } else {
            error = message;
        }

        if (error) {
            if (error instanceof Error && error.stack) {
                this.logger.error(error.stack, { place });
            } else {
                this.logger.error(error, { place });
            }
        }
    }

    public createChildLogger(...labels: string[]): BotLogger {
        const newLabels: string[] = [];
        newLabels.push(...this.labels);
        newLabels.push(...labels);
        return new BotLogger(newLabels);
    }
}