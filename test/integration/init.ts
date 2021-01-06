import { helper } from "./helper";
import { readFileSync } from "fs";

const MAIN_MODULE = "dist/main.min.js";
const MAIN_MODULE_MAP = "dist/main.min.js.map.js";
export const TEST_USERNAME = "testUser";

export async function addPlayer(): Promise<void> {
    const ROOM_NAME = "W0N0";
    await helper.server.world.addRoom(ROOM_NAME);
    await helper.server.world.addRoomObject(ROOM_NAME, STRUCTURE_CONTROLLER, 10, 10, { level: 1 });
    const modules = {
        "main": readFileSync(MAIN_MODULE).toString(),
        "main.js.map": readFileSync(MAIN_MODULE_MAP).toString()
    }
    helper.player = await helper.server.world.addBot({
        username: TEST_USERNAME,
        room: ROOM_NAME,
        x: 25,
        y: 25,
        modules
    });
}