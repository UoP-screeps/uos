import { assert } from "chai";
import { Container, Snapshot } from "typescript-ioc";
import { MQService } from "../../../src/mq/MQService";
import { Consume } from "../../../src/mq/Decorator";

describe("Mq Decorator", function () {
    let snapshot: Snapshot;
    let registered: Optional<{
        channel: string;
        callback: (message: string) => boolean;
    }>;

    before(function () {
        snapshot = Container.snapshot();
        // create service class
        class TestMQServiceImpl extends MQService {
            broadcast(): void {
                throw Error();
            }

            register(channel: string, callback: (message: string) => boolean): void {
                registered = { channel, callback };
            }

            send(): void {
                throw Error();
            }

            reset(): void {
                throw Error();
            }
        }
    });
    after(function () {
        snapshot.restore();
    });

    beforeEach(function () {
        registered = undefined;
    });
    it("should not register on class declaration", function () {
        const channel = "channel";
        class T {
            @Consume(channel)
            consume() {
                return;
            }
        }
        assert.isUndefined(registered);
    });

    it("should register channel correctly on a new instance", function () {
        const channel = "channel";
        class T {
            @Consume(channel)
            consume() {
                return;
            }
        }
        const a = new T();
        assert.equal(registered?.channel, channel);
    });

    it("should register callback correctly on a new instance", function () {
        const channel = "channel";
        let called: { obj: T; message: string }[] = [];
        class T {
            @Consume(channel)
            consume(message: string) {
                called.push({ obj: this, message: message });
                return;
            }
        }
        const a = new T();
        const message = "message";
        registered?.callback(message);
        assert.deepEqual(called, [{ obj: a, message: message }]);
    });
});
