import { ProcessError } from "./ProcessError";
import { UosProcessLauncher } from "./ProcessLauncher";
import { ProgramIndex } from "./ProgramIndex";

export class UosProcess<T = TData> extends UosProcessLauncher implements RunnableProcess {
    readonly pid: string;

    private readonly memory: ProcessMemory;
    private readonly program: Program;

    constructor(pid: string, data?: T, priority?: number, parent?: string | null, programName?: string) {
        if (data !== undefined && priority !== undefined && parent !== undefined && programName !== undefined) {
            Memory.uos.processes[pid] = {
                data: data,
                priority: priority,
                processes: {},
                parent: parent,
                programName: programName
            };
        }
        super(Memory.uos.processes[pid].processes);
        this.pid = pid;
        this.memory = Memory.uos.processes[pid];
        if (this.memory === undefined) {
            throw new ProcessError(`Process ${pid} is not running`);
        }
        this.program = new ProgramIndex[this.memory.programName]();
    }

    get priority(): number {
        return this.memory.priority;
    }

    set priority(value) {
        this.memory.priority = value;
    }

    get data(): TData {
        return this.memory.data;
    }

    run(): void {
        // terminate if parent has terminated
        if (this.memory.parent) {
            try {
                global.kernel.getProcessByPid(this.memory.parent);
            } catch (e) {
                this.memory.parent = null;
                this.terminate();
                return;
            }
        }
        this.program.run(this);
    }

    terminate(): void {
        this.deleteFromParent();
        this.deleteFromProcessList();
    }

    private deleteFromParent(): void {
        if (!this.memory.parent) {
            return;
        }
        const parentMemory = Memory.uos.processes[this.memory.parent];
        for (const key in parentMemory.processes) {
            if (parentMemory.processes[key] === this.pid) {
                delete parentMemory.processes[key];
                return;
            }
        }
    }

    private deleteFromProcessList(): void {
        delete Memory.uos.processes[this.pid];
    }
}
