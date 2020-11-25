import { Container } from "typescript-ioc";

export abstract class MQService {
    abstract register(channel: string, callback: (message: string) => boolean): void;
    abstract send(channel: string, message: string): void;
    abstract broadcast(channel: string, message: string): void;
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
