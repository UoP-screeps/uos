import { ROOM_HEIGHT, ROOM_WIDTH } from "../base/Constants";
import Base64Utils from "./Base64Utils";
import { CompressionUtils } from "./CompressionUtils";

export default class PosUtils {
    static serializeRoomPosList(posList: RoomPos[]): string {
        const byteArr = new Uint8Array(Math.ceil((ROOM_WIDTH * ROOM_HEIGHT) / 8));
        posList.forEach((roomPos) => {
            const bit = roomPos.x * ROOM_WIDTH + roomPos.y;
            const byte = ~~(bit / 8);
            const bitRemainder = bit % 8;
            byteArr[byte] |= 1 << bitRemainder;
        });
        const compressed = CompressionUtils.compress(byteArr.buffer);
        return Base64Utils.encode(compressed);
    }

    static deserializeRoomPosList(value: string): RoomPos[] {
        const compressedArr = Base64Utils.decode(value);
        const byteArr = new Uint8Array(CompressionUtils.decompress(compressedArr));
        const roomPosArr: RoomPos[] = [];
        let bit = 0;
        for (const byte of byteArr) {
            for (let bitRemainder = 0; bitRemainder < 8; bitRemainder++) {
                const mask = 1 << bitRemainder;
                if (byte & mask) {
                    roomPosArr.push({ x: Math.floor(bit / ROOM_WIDTH), y: bit % ROOM_WIDTH });
                }
                bit++;
            }
        }
        return roomPosArr;
    }
}
