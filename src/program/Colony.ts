import { RoomUtils } from "../utils/RoomUtils";
import { registerProgram } from "../uos/ProgramIndex";
import { PROGRAM_COLONY, PROGRAM_HARVEST_SOURCE } from "./ProgramNames";

export class Colony implements Program {
    run(process: Process<ColonyData>): void {
        const data = process.data as ColonyData;
        const room = Game.rooms[data.roomName];
        if (!data.sources) {
            data.sources = RoomUtils.getSources(room).map((v) => v.id);
        }
        data.sources.map(((value, index) => {
            const processLabel = `harvest source${index}`;
            if (!process.isProcessRunning(processLabel)) {
                process.launchProcess(processLabel, PROGRAM_HARVEST_SOURCE, { id: value });
            }
        }));
    }
}

registerProgram(PROGRAM_COLONY, Colony);


export interface ColonyData {
    roomName: string;
    sources?: Id<Source>[];
}