import { assert } from "chai";
import { MQService } from "../../../src/mq/MQService";
import { Container } from "typescript-ioc";

function createFunction(returnVal: boolean, checkArray: string[]) {
    return function (message: string) {
        checkArray.push(message);
        return returnVal;
    };
}

describe("MQService", function () {
    let mqService: MQService;
    const channel0 = "channel0";
    const channel1 = "channel1";
    const message0 = "message0";
    const message1 = "message1";
    before(function () {
        mqService = Container.get(MQService);
    });

    beforeEach(function () {
        mqService.reset();
    });

    it("should send message to registered function", function () {
        const f1Called: string[] = [];
        const f1 = createFunction(true, f1Called);

        mqService.register(channel0, f1);
        mqService.send(channel0, message0);
        assert.deepEqual(f1Called, [message0]);
    });
    it("should send message to different channels", function () {
        const f1Called: string[] = [];
        const f2Called: string[] = [];

        const f1 = createFunction(true, f1Called);

        const f2 = createFunction(true, f2Called);

        mqService.register(channel0, f1);
        mqService.register(channel1, f2);
        mqService.send(channel0, message0);
        mqService.send(channel1, message1);

        assert.deepEqual(
            {
                f1Called,
                f2Called
            },
            {
                f1Called: [message0],
                f2Called: [message1]
            }
        );
    });

    it("should broadcast message to different channels", function () {
        const f1Called: string[] = [];
        const f2Called: string[] = [];

        const f1 = createFunction(true, f1Called);

        const f2 = createFunction(true, f2Called);

        mqService.register(channel0, f1);
        mqService.register(channel1, f2);
        mqService.broadcast(channel0, message0);
        mqService.broadcast(channel1, message1);

        assert.deepEqual(
            {
                f1Called,
                f2Called
            },
            {
                f1Called: [message0],
                f2Called: [message1]
            }
        );
    });

    it("should send message until at least one return true when sending", function () {
        const f1Called: string[] = [];
        const f2Called: string[] = [];
        const f3Called: string[] = [];
        const f4Called: string[] = [];

        const f1 = createFunction(false, f1Called);
        const f2 = createFunction(true, f2Called);
        const f3 = createFunction(true, f3Called);
        const f4 = createFunction(false, f4Called);

        mqService.register(channel0, f1);
        mqService.register(channel0, f2);
        mqService.register(channel0, f3);
        mqService.register(channel0, f4);

        mqService.send(channel0, message0);
        assert.sameDeepMembers([f2Called, f3Called], [[], [message0]]);
    });

    it("should send to all consumers if broadcasting", function () {
        const f1Called: string[] = [];
        const f2Called: string[] = [];
        const f3Called: string[] = [];
        const f4Called: string[] = [];

        const f1 = createFunction(false, f1Called);
        const f2 = createFunction(true, f2Called);
        const f3 = createFunction(true, f3Called);
        const f4 = createFunction(false, f4Called);

        mqService.register(channel0, f1);
        mqService.register(channel0, f2);
        mqService.register(channel0, f3);
        mqService.register(channel0, f4);

        mqService.broadcast(channel0, message0);
        assert.sameDeepMembers(
            [f1Called, f2Called, f3Called, f4Called],
            [[message0], [message0], [message0], [message0]]
        );
    });
});
