import { CircularArray } from "./CircularArray";

const COLORS: { [type: string]: string } = {
    WARNING: "#f90",
    ERROR: "#f00",
    FATAL: "#f00"
};

const LEVELS = ["FINEST", "FINE", "INFO", "WARNING", "ERROR", "FATAL"];
const DEFAULT_LEVEL = 2;
const LOG_SIZE = 10000;
const logs: CircularArray<Log> = new CircularArray(LOG_SIZE);

function getLevel(): number {
    return (Memory.logger = Memory.logger || DEFAULT_LEVEL);
}

export const Logger: ILogger = {
    Level: {
        ALL: -Infinity,
        FINEST: 0,
        FINE: 1,
        INFO: 2,
        WARNING: 3,
        ERROR: 4,
        FATAL: 5,
        OFF: Infinity
    },

    log(message: string, level = DEFAULT_LEVEL): void {
        const log: Log = {
            message: message,
            level: level,
            time: Game.time
        };
        logs.push(log);
        if (level >= getLevel()) {
            display(log);
        }
    },

    showLogs(filter = _.constant(true)): void {
        for (const log of logs) {
            if (filter(log)) {
                display(log);
            }
        }
    },

    setLevel(level = DEFAULT_LEVEL): void {
        Memory.logger = level;
    }
};

function display(log: Log): void {
    const output = `<p>${getLevelDataString(log.level)} ${log.message}</p>`;
    /* eslint-disable-next-line no-console */
    console.log(output);
}

function getLevelDataString(level: number): string {
    if (level in LEVELS) {
        if (COLORS[LEVELS[level]]) {
            return ` [${getColoredString(LEVELS[level], COLORS[LEVELS[level]])}]`;
        } else {
            return ` [${LEVELS[level]}]`;
        }
    }
    return "";
}

function getColoredString(str: string, color: string): string {
    return `<span style="color:${color};"> ${str}</span>`;
}

global.Logger = Logger;
