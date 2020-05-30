import { ProgramIndex } from "../ProgramIndex";

export function clearProgramIndex() {
    _.keys(ProgramIndex).forEach((key) => delete ProgramIndex[key]);
}