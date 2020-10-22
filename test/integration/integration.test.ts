import { assert } from "chai";
import { helper } from "./helper";

describe("main", () => {
    before(() => {
        helper.before();
    });

    beforeEach(async () => {
        await helper.beforeEach();
    });

    afterEach(async () => {
        await helper.afterEach();
    });

    it("test integration", async () => {
        for (let i = 1; i < 10; i += 1) {
            assert.equal(await helper.server.world.gameTime, i);
            await helper.server.tick();
        }
    });
});