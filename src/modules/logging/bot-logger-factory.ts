import { BotLogger } from "./classes/bot-logger";

export const createLogger = (...labels: string[]): BotLogger => {
    return new BotLogger({ labels });
};

export const createFileLogger = (): BotLogger => {
    const e = new Error();

    const regex = /\((.*):(\d+):(\d+)\)$/
    const match = regex.exec((e.stack as string).split("\n")[2]) as RegExpExecArray;

    const paths = match[1].split('/').reverse();
    const place = paths[0].startsWith('index') ? (paths[1] + '/' + paths[0]) : paths[0];

    return createLogger(place);
};