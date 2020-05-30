import { ProcessError } from "./ProcessError";
import { UosProcessFactory } from "./ProcessFactory";
import { makeId } from "../utils/Id";
import { DEFAULT_PRIORITY } from "./Consts";

export class UosProcessLauncher implements ProcessLauncher{
    readonly pid?: string;
    private readonly processMemory: {[label: string]: string};

    constructor(processMemory: {[label: string]: string}){
        this.processMemory = processMemory;
    }

    getProcessByLabel(label: string): Process {
        const pid = this.processMemory[label];
        if(!pid){
            throw new ProcessError(`Process with label ${label} does not exist`);
        }
        return global.kernel.getProcessByPid(pid);
    }


    isProcessRunning(label: string): boolean {
        return !!this.processMemory[label];
    }

    launchProcess(label: string, programName: string, data: TJSON): void {
        if(this.isProcessRunning(label)){
            throw new ProcessError(`Process with label ${label} is already running`);
        }
        const processFactory = new UosProcessFactory();
        const process = processFactory.createProcess(makeId(), data, DEFAULT_PRIORITY, this.pid);
        this.processMemory[label] = process.pid;
    }

}