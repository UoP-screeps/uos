import { ProcessError } from "./ProcessError";
import { UosProcessFactory } from "./ProcessFactory";
import { UosProcessLauncher } from "./ProcessLauncher";

export class UosKernel extends UosProcessLauncher implements Kernel{

    private readonly processes: {[pid: string]: RunnableProcess};
    constructor(){
        if(!Memory.uos){
            UosKernel.initializeMemory();
        }
        super(Memory.uos.kernelProcesses);
        global.kernel = this;
        this.processes = {};
    }

    run(): void {
        this.runAllProcesses();
    }

    getProcessByPid<T = TData>(pid: string): RunnableProcess {
        const processFactory = new UosProcessFactory();
        if(!Memory.uos.processes[pid]){
            throw new ProcessError(`Process ${pid} is not running`);
        }
        return this.processes[pid] = this.processes[pid] || processFactory.createProcess(pid);
    }

    private static initializeMemory(): void {
        Memory.uos = {
            kernelProcesses: {},
            processes: {}
        };
    }
    
    private runAllProcesses(): void{
        const processStack: RunnableProcess[] = [];
        for(const label in Memory.uos.kernelProcesses){
            const pid = Memory.uos.kernelProcesses[label];
            const process = this.getProcessByPid(pid);
            processStack.push(process);
        }
        let current = processStack.pop();
        while (current){
            current.run();
            if(!Memory.uos.processes[current.pid]){
                current = processStack.pop();
                continue;
            }
            for(const pid in Memory.uos.processes[current.pid].processes){
                const process = this.getProcessByPid(Memory.uos.processes[current.pid].processes[pid]);
                processStack.push(process);
            }
            current = processStack.pop();
        }
    }
}
