import { Game, Memory, resetGameAndMemory } from "../../mock";
import { makeId } from "../../../src/utils/Id";
import { assert } from "chai";

resetGameAndMemory();

describe("ID", function() {
    beforeEach(function() {
        resetGameAndMemory();
    });

    it("Should display correct id", function() {
        const id1 = makeId();
        const id2 = makeId();
        assert.deepEqual([id1, id2], ["000-000-000", "000-000-001"]);
    });

    it("Should never repeat", function() {
        const set = new Set<string>();
        let repeated = false;
        for (let i = 0; i < 100000; i++) {
            const id = makeId();
            if (set.has(id)) {
                repeated = true;
                break;
            }
            set.add(id);
        }
        assert.isFalse(repeated);
    });
});
