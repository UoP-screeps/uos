import { ProcessError } from "./ProcessError";
import { UosProcessFactory } from "./ProcessFactory";
import { makeId } from "../utils/Id";
import { DEFAULT_PRIORITY } from "./Consts";

export abstract class UosProcessLauncher implements ProcessLauncher {
    readonly pid?: string;
    private readonly processMemory: { [label: string]: string };

    constructor(processMemory: { [label: string]: string }) {
        this.processMemory = processMemory;
    }

    getProcessByLabel<T = TData>(label: string): Process<T> {
        const pid = this.processMemory[label];
        if (!pid) {
            throw new ProcessError(`Process with label ${label} does not exist`);
        }
        return global.kernel.getProcessByPid(pid);
    }

    isProcessRunning(label: string): boolean {
        return !!this.processMemory[label];
    }

    launchProcess<T>(label: string, programName: string, data: T): void {
        if (this.isProcessRunning(label)) {
            throw new ProcessError(`Process with label ${label} is already running`);
        }
        const processFactory = new UosProcessFactory();
        const process = processFactory.createProcess<T>(
            makeId(),
            data,
            DEFAULT_PRIORITY,
            this.pid || null,
            programName
        );
        this.processMemory[label] = process.pid;
        Memory.uos.queue.push(process.pid);
    }
}
