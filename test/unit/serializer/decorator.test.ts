import { assert } from "chai";
import { Table } from "../../../src/serializer/Decorator";
import getPrototypeOf = Reflect.getPrototypeOf;

describe("Title decorator", () => {
    const VALUE = "1";
    @Table
    class A {
        a: string;
        constructor(v: string) {
            this.a = v;
        }
    }
    it("should generate a correct $tableType field for the object", function() {
        const a = new A(VALUE);
        const rawA = (a as TableType<A>).$tableType;
        const rawConstructed = new rawA(VALUE);
        const plainObject = {
            a: VALUE
        }
        assert.deepEqual(rawConstructed, plainObject);
        assert.notDeepEqual(rawConstructed, a);
    });
    it("should not change existing fields", function() {
        const a = new A(VALUE);
        assert.equal(a.a, VALUE);
    })
})