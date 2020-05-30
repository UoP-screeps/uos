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

class Dummy implements Program{
    run(this: Process): void {
        return;
    }
}

class Counting implements Program{
    run(this: Process<{a: number}>): void {
        this.data.a = this.data.a || 0;
        this.data.a ++;
    }
}

class Launching implements Program{
    run(this: Process): void {
        this.launchProcess('test', 'launched', {});
    }
}

class Deleting implements Program{
    run(this: Process): void {
        this.terminate();
    }
}
