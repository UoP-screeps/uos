import { ProcessError } from "./ProcessError";
import { UosProcessFactory } from "./ProcessFactory";
import { UosProcessLauncher } from "./ProcessLauncher";

export class UosKernel extends UosProcessLauncher implements Kernel {
    private readonly processes: { [pid: string]: RunnableProcess };

    constructor() {
        if (!Memory.uos) {
            UosKernel.initializeMemory();
        }
        super(Memory.uos.kernelProcesses);
        global.kernel = this;
        this.processes = {};
        UosKernel.clearProcessQueue();
    }

    run(): void {
        this.runAllProcesses();
    }

    getProcessByPid<T = TData>(pid: string): RunnableProcess {
        const processFactory = new UosProcessFactory();
        if (!Memory.uos.processes[pid]) {
            throw new ProcessError(`Process ${pid} is not running`);
        }
        return (this.processes[pid] = this.processes[pid] || processFactory.createProcess(pid));
    }

    private static initializeMemory(): void {
        Memory.uos = {
            kernelProcesses: {},
            processes: {},
            queue: []
        };
    }

    private static clearProcessQueue(): void {
        Memory.uos.queue.length = 0;
    }

    private runAllProcesses(): void {
        Memory.uos.queue = _.sortBy(_.keys(Memory.uos.processes), (value) => {
            return -Memory.uos.processes[value].priority;
        });
        let pid;
        while ((pid = Memory.uos.queue.shift())) {
            const process = this.getProcessByPid(pid);
            process.run();
        }
    }
}
