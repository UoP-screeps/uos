import { UosProcess } from "./Process";

export class UosProcessFactory implements ProcessFactory{
    createProcess(pid: string, data?: TData, priority?: number, parent?: string | null): Process {
        return new UosProcess(pid, data, priority, parent);
    }
}