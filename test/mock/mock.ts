import { RoomPositionImpl } from "./RoomPosition";

export const Game = {};

export const Memory = {};

export function reset() {
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(Game);
    // @ts-ignore : allow adding Memory to global
    global.Memory = _.clone(Memory);
    // @ts-ignore : Mocking RoomPosition
    global.RoomPosition = RoomPositionImpl;
}
