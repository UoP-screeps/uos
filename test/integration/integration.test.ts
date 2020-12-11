import { assert } from "chai";
import { helper } from "./helper";

const { readFileSync } = require("fs");
const DIST_MAIN_JS = "dist/main.js";
const DIST_MAIN_JS_MAP = "dist/main.js.map.js";

describe("mock server", () => {
    before(() => {
        helper.before();
    });

    beforeEach(async () => {
        await helper.beforeEach();
    });

    afterEach(async () => {
        await helper.afterEach();
    });

    it("should tick time correctly", async () => {
        for (let i = 1; i < 10; i += 1) {
            assert.equal(await helper.server.world.gameTime, i);
            await helper.server.tick();
        }

        const { db } = helper.server.common.storage;
        const C = helper.server.constants;

        await helper.server.world.addRoom("W0N0");
        await helper.server.world.addRoomObject("W0N0", "controller", 10, 10, { level: 1 });

        const modules = {
            main: readFileSync(DIST_MAIN_JS).toString(),
            "main.js.map": readFileSync(DIST_MAIN_JS_MAP).toString()
        };
        helper.player = await helper.server.world.addBot({ username: "tester", room: "W0N0", x: 21, y: 26, modules });
        await helper.server.tick();
    });
});
