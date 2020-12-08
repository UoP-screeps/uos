/* eslint-disable @typescript-eslint/no-explicit-any */
import { MQService } from "./MQService";
import { Container } from "typescript-ioc";

/**
 * 必须用于静态方法。如果收到来自于 channel 的消息，就会调用该方法。
 */
export function Consume(channel: string): (target: any, propertyKey: string) => void {
    return function (target, propertyKey): void {
        const f = target[propertyKey] as (message: string) => boolean;
        Container.get(MQService).register(channel, f);
    };
}
