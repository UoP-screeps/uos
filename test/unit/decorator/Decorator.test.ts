import { Container, Inject, OnlyInstantiableByContainer } from "typescript-ioc";
import { assert } from "chai";

describe("decorator", () => {
    it("should inject a class", function() {
        abstract class Inf {
            abstract getValue(): number;
        }

        class Impl extends Inf {
            getValue(): number {
                return 1;
            }
        }

        @OnlyInstantiableByContainer
        class ConstructorInjection {
            private inf: Inf;

            constructor(@Inject inf: Inf) {
                this.inf = inf;
            }

            getValue() {
                return this.inf.getValue();
            }
        }

        @OnlyInstantiableByContainer
        class FieldInjection {
            @Inject
            private inf!: Inf;

            getValue() {
                return this.inf.getValue();
            }
        }

        Container.configure({ bind: Inf, to: Impl },
            { bind: ConstructorInjection },
            { bind: FieldInjection }
        );

        const c = Container.get(ConstructorInjection);

        const d = Container.get(FieldInjection);

        assert.equal(c.getValue(), 1);

        assert.equal(d.getValue(), 1);

    });
});