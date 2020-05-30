import { UosProcess } from "./Process";

export class UosProcessFactory implements ProcessFactory{
    createProcess<T = TData>(pid: string, data?: T, priority?: number, parent?: string | null, programName?: string): RunnableProcess {
        return new UosProcess(pid, data, priority, parent, programName);
    }
}