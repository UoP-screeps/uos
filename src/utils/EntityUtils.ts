export function createRoomPosition(pos: Pos): RoomPosition {
    return new RoomPosition(pos.x, pos.y, pos.roomName);
}
