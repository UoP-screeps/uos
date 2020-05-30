export const ProgramIndex: { [programName: string]: ProgramConstructor } = {};

export function registerProgram(name: string, program: ProgramConstructor): void {
    ProgramIndex[name] = program;
}
