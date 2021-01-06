import { assert } from "chai";
import { helper } from "./helper";
import { addPlayer } from "./init";

describe("mock server", () => {
    before(() => {
        helper.before();
    });

    beforeEach(async () => {
        await helper.beforeEach();
        await addPlayer();
    });

    afterEach(async () => {
        await helper.afterEach();
    });

    it("should tick time correctly", async () => {
        for (let i = 1; i < 10; i += 1) {
            const currentTick = await helper.server.world.gameTime;
            assert.equal(currentTick, i);
            const notifications = await helper.tickAndGetNotifications();

            notifications.forEach(v => console.log(`[${currentTick}]: ${v}`))
        }
    });
});
