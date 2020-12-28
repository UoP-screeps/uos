import {assert} from "chai";
import ObjectUtils from "../../../src/utils/ObjectUtils";

describe("ObjectUtils", function() {
    it("should clear an object with removeAll", function() {
        const a: {[key: string]: string} = {
            a: "a",
            b: "b"
        };
        ObjectUtils.removeAll(a);
        assert.isEmpty(a);
        assert.notExists(a["a"]);
        assert.notExists(a["b"]);
    });

    it("should not clear inherited properties with removeAll", function() {
        class A {
            x?: number;
        }
        A.prototype.x = 1;
        const a = new A();
        ObjectUtils.removeAll(a);
        assert.exists(a.x);
    });

    it("should report an empty object with isEmpty", function() {
        const a = {};
        assert.isTrue(ObjectUtils.isEmpty(a));
    });

    it("should report an non-empty object with isEmpty", function() {
        const b = {"a": 1};
        assert.isFalse(ObjectUtils.isEmpty(b));
    });
});