import { assert } from "chai";
import { helper } from "./helper";

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
    });
});