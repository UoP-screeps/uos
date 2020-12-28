export class RoomPositionImpl implements RoomPosition{
    roomName: string;
    x: number;
    y: number;
    prototype: RoomPosition;

    constructor(x: number, y: number, roomName: string) {
        this.x = x;
        this.y = y;
        this.roomName = roomName;
        this.prototype = RoomPositionImpl.prototype;
    }

    createConstructionSite(structureType: BuildableStructureConstant): ScreepsReturnCode;
    createConstructionSite(structureType: STRUCTURE_SPAWN, name?: string): ScreepsReturnCode;
    createConstructionSite(structureType: BuildableStructureConstant | STRUCTURE_SPAWN, name?: string): ScreepsReturnCode {
        throw Error("Unimplemented");
    }

    createFlag(name?: string, color?: ColorConstant, secondaryColor?: ColorConstant): ERR_NAME_EXISTS | ERR_INVALID_ARGS | string {
        throw Error("Unimplemented");
    }

    findClosestByPath<K extends FindConstant>(type: K, opts?: FindPathOpts & Partial<FilterOptions<K>> & { algorithm?: FindClosestByPathAlgorithm }): FindTypes[K] | null;
    findClosestByPath<T extends Structure>(type: FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_HOSTILE_STRUCTURES, opts?: FindPathOpts & Partial<FilterOptions<FIND_STRUCTURES>> & { algorithm?: FindClosestByPathAlgorithm }): T | null;
    findClosestByPath<T extends _HasRoomPosition | RoomPosition>(objects: T[], opts?: FindPathOpts & { filter?: ((object: T) => boolean) | FilterObject | string; algorithm?: FindClosestByPathAlgorithm }): T | null;
    findClosestByPath(type: unknown, opts?: unknown): any {
        throw Error("Unimplemented");

    }

    findClosestByRange<K extends FindConstant>(type: K, opts?: FilterOptions<K>): FindTypes[K] | null;
    findClosestByRange<T extends Structure>(type: FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_HOSTILE_STRUCTURES, opts?: FilterOptions<FIND_STRUCTURES>): T | null;
    findClosestByRange<T extends _HasRoomPosition | RoomPosition>(objects: T[], opts?: { filter: any }): T | null;
    findClosestByRange(type: unknown, opts?: unknown): any {
        throw Error("Unimplemented");
    }

    findInRange<K extends FindConstant>(type: K, range: number, opts?: FilterOptions<K>): Array<FindTypes[K]>;
    findInRange<T extends Structure>(type: FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_HOSTILE_STRUCTURES, range: number, opts?: FilterOptions<FIND_STRUCTURES>): T[];
    findInRange<T extends _HasRoomPosition | RoomPosition>(objects: T[], range: number, opts?: { filter?: any }): T[];
    findInRange(type: unknown, range: number, opts?: unknown): any {
        throw Error("Unimplemented");
    }

    findPathTo(x: number, y: number, opts?: FindPathOpts): PathStep[];
    findPathTo(target: RoomPosition | _HasRoomPosition, opts?: FindPathOpts): PathStep[];
    findPathTo(x: number | RoomPosition | _HasRoomPosition, y?: number | FindPathOpts, opts?: FindPathOpts): PathStep[] {
        throw Error("Unimplemented");
    }

    getDirectionTo(x: number, y: number): DirectionConstant;
    getDirectionTo(target: RoomPosition | _HasRoomPosition): DirectionConstant;
    getDirectionTo(x: number | RoomPosition | _HasRoomPosition, y?: number): DirectionConstant {
        throw Error("Unimplemented");
    }

    getRangeTo(x: number, y: number): number;
    getRangeTo(target: RoomPosition | { pos: RoomPosition }): number;
    getRangeTo(x: number | RoomPosition | { pos: RoomPosition }, y?: number): number {
        throw Error("Unimplemented");
    }

    inRangeTo(x: number, y: number, range: number): boolean;
    inRangeTo(target: RoomPosition | { pos: RoomPosition }, range: number): boolean;
    inRangeTo(x: number | RoomPosition | { pos: RoomPosition }, y: number, range?: number): boolean {
        throw Error("Unimplemented");
    }

    isEqualTo(x: number, y: number): boolean;
    isEqualTo(target: RoomPosition | { pos: RoomPosition }): boolean;
    isEqualTo(x: number | RoomPosition | { pos: RoomPosition }, y?: number): boolean {
        if(typeof x === 'number') {
            return this.x == x && this.y == y;
        }
        if("pos" in x) {
            return this.x === x.pos.x && this.y === x.pos.y && this.roomName === x.pos.roomName;
        }
        return this.roomName === x.roomName && this.x === x.x && this.y === x.y;
    }

    isNearTo(x: number, y: number): boolean;
    isNearTo(target: RoomPosition | { pos: RoomPosition }): boolean;
    isNearTo(x: number | RoomPosition | { pos: RoomPosition }, y?: number): boolean {
        throw Error("Unimplemented");
    }

    look(): LookAtResult[] {
        throw Error("Unimplemented");
    }

    lookFor<T extends keyof AllLookAtTypes>(type: T): Array<AllLookAtTypes[T]> {
        throw Error("Unimplemented");
    }

}