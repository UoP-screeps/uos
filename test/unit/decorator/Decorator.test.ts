import { Container, Inject, OnlyInstantiableByContainer } from "typescript-ioc";
import { assert } from "chai";

describe("decorator", () => {
    it("should inject a class", function() {
        abstract class Interface {
            abstract getValue(): number;
        }

        class Implementation extends Interface {
            getValue(): number {
                return 1;
            }
        }

        @OnlyInstantiableByContainer
        class ConstructorInjection {
            private interface: Interface;

            constructor(@Inject inf: Interface) {
                this.interface = inf;
            }

            getValue() {
                return this.interface.getValue();
            }
        }

        @OnlyInstantiableByContainer
        class FieldInjection {
            @Inject
            private interface!: Interface;

            getValue() {
                return this.interface.getValue();
            }
        }

        Container.configure({ bind: Interface, to: Implementation },
            { bind: ConstructorInjection },
            { bind: FieldInjection }
        );

        const c = Container.get(ConstructorInjection);

        const d = Container.get(FieldInjection);

        assert.equal(c.getValue(), 1);

        assert.equal(d.getValue(), 1);

    });
});