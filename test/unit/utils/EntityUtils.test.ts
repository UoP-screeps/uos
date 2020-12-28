import { createRoomPosition } from "../../../src/utils/EntityUtils";
import { assert } from "chai";

describe("RoomPosition", function () {
    it("should create a correct instance of room position", function () {
        const pos = new RoomPosition(1, 1, "x");
        const posArg = { x: 1, y: 1, roomName: "x" }
        const createdPos = createRoomPosition(posArg);
        assert.isTrue(pos.isEqualTo(createdPos));
        assert.include(createdPos, posArg);
    });
});
