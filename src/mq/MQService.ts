import { Container } from "typescript-ioc";

export abstract class MQService {
    /**
     * 注册一个回调函数。如果需要直接使用这个方法，需要手动在global reset之后重新注册。
     * 回调函数应该返回true / false，表示是否消费该事件。
     * @param channel 注册的频道
     * @param callback 注册的回调函数
     */
    abstract register(channel: string, callback: (message: string) => boolean): void;

    /**
     * 发送消息到频道，单次消费。
     * @param channel 需要发送到的频道
     * @param message 需要发送的消息
     */
    abstract send(channel: string, message: string): void;

    /**
     * 发送消息到频道的所有接收者
     * @param channel 需要发送到的频道
     * @param message 需要发送的消息
     */
    abstract broadcast(channel: string, message: string): void;

    /**
     * 测试用方法，用于重置所有注册的函数和频道。
     */
    abstract reset(): void;
}

class MQServiceImpl extends MQService {
    private readonly callbacks: {
        [channel: string]: Optional<((message: string) => boolean)[]>;
    };
    constructor() {
        super();
        this.callbacks = {};
    }
    broadcast(channel: string, message: string): void {
        this.callbacks[channel]?.forEach((f) => {
            f(message);
        });
    }

    register(channel: string, callback: (message: string) => boolean): void {
        this.callbacks[channel] = this.callbacks[channel] || [];
        this.callbacks[channel]?.push(callback);
    }

    reset(): void {
        Object.keys(this.callbacks).forEach((key) => delete this.callbacks[key]);
    }

    send(channel: string, message: string): void {
        this.callbacks[channel]?.every((f) => {
            return !f(message);
        });
    }
}

Container.bind(MQService).to(MQServiceImpl);
