import { nonNull } from "./Utils";

const sourceData:MultipleRoomData<Source> = {};
const mineralData: SingleRoomData<Mineral> = {};
const spawnData: MultipleRoomData<StructureSpawn> = {};

export class RoomUtils{
    static getSources(room: Room): Source[]{
        if(!sourceData[room.name]){
            sourceData[room.name] = room.find(FIND_SOURCES).map((v) => v.id);
        }
        return sourceData[room.name].map((v) => nonNull(Game.getObjectById(v)));
    }

    static getMineral(room: Room): Mineral{
        if(!mineralData[room.name]){
            mineralData[room.name] = room.find(FIND_MINERALS)[0].id;
        }
        return nonNull(Game.getObjectById(mineralData[room.name]));
    }
}

interface MultipleRoomData<T> {
    [roomName: string]: Id<T>[];
}

interface SingleRoomData<T> {
    [roomName: string]: Id<T>;
}