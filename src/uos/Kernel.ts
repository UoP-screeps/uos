import { ProcessError } from "./ProcessError";
import { UosProcessFactory } from "./ProcessFactory";
import { UosProcessLauncher } from "./ProcessLauncher";

export class UosKernel extends UosProcessLauncher implements Kernel{

    private readonly processes: {[pid: string]: Process};
    constructor(){
        Memory.uos.kernelProcesses = Memory.uos.kernelProcesses || {};
        super(Memory.uos.kernelProcesses);
        global.kernel = this;
        this.processes = {};
    }

    run(): void {
        if(!Memory.uos){
            initializeMemory();
        }
        return;
    }

    getProcessByPid(pid: string): Process {
        const processFactory = new UosProcessFactory();
        if(!Memory.uos.processes[pid]){
            throw new ProcessError(`Process ${pid} is not running`);
        }
        return this.processes[pid] = this.processes[pid] || processFactory.createProcess(pid);
    }
}

function initializeMemory(): void {
    Memory.uos = {
        kernelProcesses: {},
        processes: {}
    };
}