import { ProgramIndex, registerProgram } from "../ProgramIndex";

export function clearProgramIndex() {
    _.keys(ProgramIndex).forEach((key) => delete ProgramIndex[key]);
}

export function makeDummyProgram(programName: string) {
    registerProgram(programName, Dummy);
}

export function makeCountingProgram(programName: string) {
    registerProgram(programName, Counting);
}

export function makeLaunchingProgram(programName: string) {
    registerProgram(programName, Launching);
}

export function makeDeletingProgram(programName: string) {
    registerProgram(programName, Deleting);
}

export function makeLowPriorityProgram(programName: string) {
    registerProgram(programName, LowPriority);
}

export function makeMidPriorityProgram(programName: string) {
    registerProgram(programName, MidPriority);
}

export function makeHighPriorityProgram(programName: string) {
    registerProgram(programName, HighPriority);
}

class Dummy implements Program {
    run(this: Process): void {
        return;
    }
}

class Counting implements Program {
    run(this: Process<{ a: number }>): void {
        this.data.a = this.data.a || 0;
        this.data.a++;
    }
}

class Launching implements Program {
    run(this: Process): void {
        this.launchProcess("test", "launched", {});
    }
}

class Deleting implements Program {
    run(this: Process): void {
        this.terminate();
    }
}

export let testProgramRunCount = 0;
export function resetTestProgramRunCount(){
    testProgramRunCount = 0;
}
class LowPriority implements Program{
    run(this: Process): void {
        this.priority = 0;
        this.data.a = testProgramRunCount;
        testProgramRunCount ++;
    }
}

class MidPriority implements Program{
    run(this: Process): void {
        this.priority = 6;
        this.data.a = testProgramRunCount;
        testProgramRunCount ++;
    }
}

class HighPriority implements Program{
    run(this: Process): void {
        this.priority = 12;
        this.data.a = testProgramRunCount;
        testProgramRunCount ++;
    }
}


