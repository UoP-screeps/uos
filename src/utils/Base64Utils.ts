const RANGE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const BASE = 64;
const BITS_PER_BYTE = 8;
const BITS_PER_CHAR = 6;
const PADDING_CHAR = RANGE[BASE];

const NUM_MAP: { [char: string]: number } = {};
RANGE.split("").map((c, i) => (NUM_MAP[c] = i));
const GROUP_SIZE = 3;
const CHAR_BITMASK = 0b111111;
const BYTE_BITMASK = 0b11111111;

export default class Base64Utils {
    static encode(arr: ArrayBufferLike): string {
        let result = "";
        const bytes = new Uint8Array(arr);
        const byteLength = bytes.byteLength;
        const byteRemainder = byteLength % GROUP_SIZE; // 3 bytes produce 4 chars
        const mainLength = byteLength - byteRemainder;

        // deal with main length
        for (let i = 0; i < mainLength; i += GROUP_SIZE) {
            // Combine the three bytes into a single integer "chunk"
            // i is smaller than mainLength, so bytes[i] should not be null

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const firstByte = bytes[i]!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const secondByte = bytes[i + 1]!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const thirdByte = bytes[i + 2]!;
            const chunk = (firstByte << (BITS_PER_BYTE * 2)) | (secondByte << BITS_PER_BYTE) | thirdByte;

            // split the chunk into 4 numbers
            const a = (chunk & (CHAR_BITMASK << (BITS_PER_CHAR * 3))) >> (BITS_PER_CHAR * 3);
            const b = (chunk & (CHAR_BITMASK << (BITS_PER_CHAR * 2))) >> (BITS_PER_CHAR * 2);
            const c = (chunk & (CHAR_BITMASK << BITS_PER_CHAR)) >> BITS_PER_CHAR;
            const d = chunk & CHAR_BITMASK;

            // range has length 65, and a, b, c, d are always smaller than 64.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result += RANGE[a]! + RANGE[b]! + RANGE[c]! + RANGE[d]!;
        }

        // deal with remaining bytes
        if (byteRemainder === 1) {
            // main length is smaller than byte length if there is a remainder.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const chunk = bytes[mainLength]!;
            const a = (chunk & (CHAR_BITMASK << 2)) >> 2;
            // set the 4 least significant bits to 0
            const b = (chunk & 0b11) << 4;

            // a and b are always less than 64.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result += RANGE[a]! + RANGE[b]! + PADDING_CHAR + PADDING_CHAR;
        } else if (byteRemainder === 2) {
            // if remainder is 2, bytes length should be mainLength + 2
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const chunk = (bytes[mainLength]! << BITS_PER_BYTE) | bytes[mainLength + 1]!;
            const a = (chunk & (CHAR_BITMASK << 10)) >> 10;
            const b = (chunk & (CHAR_BITMASK << 4)) >> 4;
            // set the 2 least significant bits to 0
            const c = (chunk & 0b1111) << 2;

            // a, b, c should be less than 64.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            result += RANGE[a]! + RANGE[b]! + RANGE[c]! + PADDING_CHAR;
        }

        return result;
    }

    static decode(input: string): ArrayBuffer {
        let byteLength = Math.ceil((input.length / 4) * 3);
        const result = new Uint8Array(byteLength);
        let j = 0;
        for (let i = 0; i < byteLength; i += GROUP_SIZE) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const a = NUM_MAP[input[j++]!]!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const b = NUM_MAP[input[j++]!]!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const c = NUM_MAP[input[j++]!]!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const d = NUM_MAP[input[j++]!]!;

            // determine byteLength by paddings
            if (c === BASE) {
                byteLength -= 2;
            } else if (d === BASE) {
                byteLength -= 1;
            }
            // convert to number
            const num =
                (a << (BITS_PER_CHAR * 3)) | (b << (BITS_PER_CHAR * 2)) | (c % BASE << BITS_PER_CHAR) | d % BASE;

            const byte1 = (num >> (BITS_PER_BYTE * 2)) & BYTE_BITMASK;
            const byte2 = (num >> BITS_PER_BYTE) & BYTE_BITMASK;
            const byte3 = num & BYTE_BITMASK;
            result[i] = byte1;
            result[i + 1] = byte2;
            result[i + 2] = byte3;
        }

        return result.buffer.slice(0, byteLength);
    }
}
