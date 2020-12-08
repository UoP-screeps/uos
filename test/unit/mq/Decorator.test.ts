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

        Container.bind(MQService).to(TestMQServiceImpl);
    });
    after(function () {
        snapshot.restore();
    });

    beforeEach(function () {
        registered = undefined;
    });
    it("should register on class declaration", function () {
        const channel = "channel";

        class T {
            @Consume(channel)
            static consume() {
                return false;
            }
        }

        assert.deepEqual(registered, { channel: channel, callback: T.consume });
    });

    it("should register channel only once on a new instance", function () {
        const channel = "channel";

        class T {
            @Consume(channel)
            static consume() {
                return false;
            }
        }

        new T();
        assert.deepEqual(registered, { channel: channel, callback: T.consume });
    });
});
