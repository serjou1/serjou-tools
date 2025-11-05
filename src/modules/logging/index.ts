import { createLogger, createFileLogger } from "./bot-logger-factory";

const defaultLogger = createLogger();

const info = (message: string): void => {
    defaultLogger.info(message);
};

export { BotLogger, setDefaultOptions } from './classes/bot-logger';
export {
    info,
    createLogger,
    createFileLogger,
};