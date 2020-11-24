export abstract class MQService {
    abstract register(channel: string, callback: (message: string) => boolean): void;
    abstract send(channel: string, message: string): void;
    abstract broadcast(channel: string, message: string): void;
    abstract reset(): void;
}
