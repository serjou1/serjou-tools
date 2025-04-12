import * as d3 from "d3";

export const sleep = async (ms: number) => {
    return new Promise((resolve) => {
        setInterval(resolve, ms);
    });
};

export function onlyUnique(value: any, index: number, array: any[]) {
    return array.indexOf(value) === index;
};

export const toStep = (value: number, step: number | string) => {
    const stepNumber = Number(step);
    if (stepNumber > 1) {
        return roundToStep(value, stepNumber);
    }

    const pr = d3.precisionFixed(stepNumber);
    const f = d3.format(`.${pr}f`);

    return Number(f(value));
};

const roundToStep = (value: number, step: number) => {
    return Math.round(value / step) * step;
};