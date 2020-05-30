type TJSON = string | null | number | boolean | TJSON[] | object | {[key: string]: TJSON};
type TData = {[key: string]: TJSON};

interface Kernel extends ProcessLauncher{
    run(): void;
    getProcessByPid(pid: string): Process;
}

interface Process extends ProcessLauncher{
    priority: number;
    readonly data: TData;
    readonly pid: string;

    terminate(): void;
    run(): void;
}

interface Program {
    run(this: Process): void;
}

interface ProgramConstructor{
    new (): Program;
}

interface ProcessFactory {
    createProcess(pid: string, data?: TData, priority?: number, parent?: string | null): Process;
}

interface ProcessLauncher {
    launchProcess(label: string, programName: string, data: TData): void;
    isProcessRunning(label: string): boolean;
    getProcessByLabel(label: string): Process;
}
