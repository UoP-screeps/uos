import {assert} from "chai";
import { Configurable } from "../../../src/utils/Decorator";

describe("the descriptors", function() {
    it("should define configurable property", function() {
        class A {
            @Configurable(false)
            a: number;
            constructor() {
                this.a = 111;
            }
        }
        const a = new A();
        try {
            a.a = 1;
            assert.fail();
        } catch (ignored) {

        }
    });
})