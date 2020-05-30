import { registerProgram } from "../uos/ProgramIndex";
import { PROGRAM_MAIN } from "./ProgramNames";

class Main implements Program {
    run(this: Process): void {
        this.data.a = {
            x: 1,
            y: 1
        };
        return;
    }
}

registerProgram(PROGRAM_MAIN, Main);
