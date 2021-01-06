import { assert } from "chai";
import PosUtils from "../../../src/utils/PosUtils";
import data from "./data/RoomPos";

describe("PosUtils", function () {
    const testArrays: { x: number; y: number }[][] = data;
    testArrays.forEach((value) => {
        it("should serialize into a short enough string", function () {
            const serializedData = PosUtils.serializeRoomPosList(value);
            console.log(`array length: ${value.length}. serialized length: ${serializedData.length}`);
            assert.isBelow(serializedData.length, 300);
        });
        it("should deserialize successfully", function() {
            const serializedData = PosUtils.serializeRoomPosList(value);
            assert.sameDeepMembers(PosUtils.deserializeRoomPosList(serializedData), value);
        });
    });
});
