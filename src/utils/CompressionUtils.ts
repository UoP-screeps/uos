/**
 * A compression algorithm using modified LZ77 algorithm
 * Header: 1 byte. Length of decompressed data.
 * 0 + 7 bits (x): Length of original data following is x.
 * 1 + 7 bits (y) + 7 bits (z): reference data at location y of length z.
 */
import * as SnappyJS from "snappyjs";

export class CompressionUtils {
    static compress(input: ArrayBufferLike): ArrayBuffer {
        return SnappyJS.compress(input);
    }

    static decompress(input: ArrayBufferLike): ArrayBuffer {
        return SnappyJS.uncompress(input);
    }
}
