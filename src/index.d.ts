interface Memory {
    id: number;
    logger: number;
}

interface Memory {
    uos: UOS;
}

interface UOS {
    kernelProcesses: {
        [label: string]: string;
    };
    processes: {
        [pid: string]: ProcessMemory;
    };
    queue: string[];

}

interface ProcessMemory {
    priority: number;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    data: any;
    processes: {
        [label: string]: string;
    };
    parent: string | null;
    programName: string;
}

declare namespace NodeJS {
    interface Global {
        kernel: Kernel;
        Logger: ILogger;
    }
}

type LoggerLevel = {
    [key in "ALL" | "FINEST" | "FINE" | "INFO" | "WARNING" | "ERROR" | "FATAL" | "OFF"]: number;
};

interface ILogger {
    Level: LoggerLevel;
    log(message: string, level?: number): void;
    showLogs(filter?: (log: Log) => boolean): void;
    setLevel(level?: number): void;
}

interface Log {
    message: string;
    level: number;
    time: number;
}
