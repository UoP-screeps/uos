import { ProgramIndex, registerProgram } from "../../../src/uos/ProgramIndex";

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
    run(process: Process): void {
        return;
    }
}

class Counting implements Program {
    run(process: Process<{ a: number }>): void {
        process.data.a = process.data.a || 0;
        process.data.a++;
    }
}

class Launching implements Program {
    run(process: Process): void {
        process.launchProcess("test", "launched", {});
    }
}

class Deleting implements Program {
    run(process: Process): void {
        process.terminate();
    }
}

let testProgramRunCount = 0;

export function resetTestProgramRunCount() {
    testProgramRunCount = 0;
}

class LowPriority implements Program {
    run(process: Process): void {
        process.priority = 0;
        process.data.a = testProgramRunCount;
        testProgramRunCount++;
    }
}

class MidPriority implements Program {
    run(process: Process): void {
        process.priority = 6;
        process.data.a = testProgramRunCount;
        testProgramRunCount++;
    }
}

class HighPriority implements Program {
    run(process: Process): void {
        process.priority = 12;
        process.data.a = testProgramRunCount;
        testProgramRunCount++;
    }
}
