import { registerProgram } from "../uos/ProgramIndex";
import { PROGRAM_MAIN } from "./ProgramNames";
import { ColonyData } from "./Colony";

class Main implements Program {
    private readonly process: Process<MainData>;

    constructor(process: Process) {
        this.process = process;
    }

    run(process: Process<MainData>): void {
        this.initiateData();
        const data: MainData = process.data as MainData;
        this.launchColonyProcesses(data.colonies);
    }

    private initiateData(): void {
        if (!this.process.data.colonies) {
            this.process.data.colonies = [];
            for (const roomName in Game.rooms) {
                if (Game.rooms[roomName]?.controller?.my) {
                    this.process.data.colonies.push(roomName);
                }
            }
        }
    }

    private launchColonyProcesses(rooms: string[]): void {
        for (const roomName of rooms) {
            const processLabel = `colony ${roomName}`;
            if (!this.process.isProcessRunning(processLabel)) {
                this.process.launchProcess<ColonyData>(processLabel, "Colony", { roomName: roomName });
            }
        }
        for (const roomName of rooms) {
            const processLabel = `colony ${roomName}`;
            if (!this.process.isProcessRunning(processLabel)) {
                this.process.launchProcess<ColonyData>(processLabel, "Colony", { roomName: roomName });
            }
        }
    }

}

registerProgram(PROGRAM_MAIN, Main);


export interface MainData {
    colonies: string[];
}