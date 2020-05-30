type TJSON = string | null | number | boolean | TJSON[] | object | { [key: string]: TJSON };
type TData = { [key: string]: TJSON };

interface Kernel extends ProcessLauncher {
    run(): void;
    getProcessByPid<T = TData>(pid: string): Process<T>;
}

interface Process<T = TData> extends ProcessLauncher {
    priority: number;
    readonly data: { [P in keyof T]?: T[P] };
    readonly pid: string;

    terminate(): void;
}

interface ProcessLauncher {
    launchProcess<T = TData>(label: string, programName: string, data: T): void;
    isProcessRunning(label: string): boolean;
    getProcessByLabel<T = TData>(label: string): Process<T>;
}

interface Program {
    run(this: Process): void;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
interface RunnableProcess extends Process<any> {
    run(): void;
}

interface ProgramConstructor {
    new (): Program;
}

interface ProcessFactory {
    createProcess<T = TData>(pid: string, data?: T, priority?: number, parent?: string | null): RunnableProcess;
}
