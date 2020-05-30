import { ProcessError } from "./ProcessError";
import { UosProcessLauncher } from "./ProcessLauncher";
import {ProgramIndex} from "./ProgramIndex";

export class UosProcess extends UosProcessLauncher implements Process{
    readonly pid: string;

    private readonly memory: ProcessMemory;
    private readonly program: Program;

    constructor(pid: string, data?: TData, priority?: number, parent?: string | null, programName?: string){
        if(data!== undefined && priority !== undefined && parent !== undefined && programName !== undefined){
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
        if(this.memory === undefined){
            throw new ProcessError(`Process ${pid} is not running`);
        }
        this.program = new ProgramIndex[this.memory.programName]();
    }

    get priority(): number{
        return this.memory.priority;
    }

    set priority(value){
        this.memory.priority = value;
    }

    get data(): TData{
        return this.memory.data;
    }

    run(): void{
        this.program.run.call(this);
    }

    terminate(): void {
        // TODO implement this method
        return;
    }


}