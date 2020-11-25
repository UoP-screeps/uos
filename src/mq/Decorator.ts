/* eslint-disable @typescript-eslint/no-explicit-any */
import { MQService } from "./MQService";
import { Container } from "typescript-ioc";

export function Consume(channel: string): (target: any, propertyKey: string) => void {
    return function (target, propertyKey): void {
        const f = target[propertyKey] as (message: string) => boolean;
        Container.get(MQService).register(channel, f);
    };
}
