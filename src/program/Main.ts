import { registerProgram } from "../uos/ProgramIndex";
import { PROGRAM_MAIN } from "./ProgramNames";

class Main implements Program {
    run(process: Process): void {
        return;
    }
}

registerProgram(PROGRAM_MAIN, Main);
