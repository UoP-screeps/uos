import { TextDecoder, TextEncoder } from "util";
import { CompressionUtils } from "../../../src/utils/CompressionUtils";
import {assert} from "chai";

describe("compression utils", function() {
    const str = "LZ77 and LZ78 are the two lossless data compression algorithms published in papers by Abraham Lempel and Jacob Ziv in 1977[1] and 1978.[2] They are also known as LZ1 and LZ2 respectively.[3] These two algorithms form the basis for many variations including LZW, LZSS, LZMA and others. Besides their academic influence, these algorithms formed the basis of several ubiquitous compression schemes, including GIF and the DEFLATE algorithm used in PNG and ZIP.";
    it("should make a byte array smaller in reasonable time", function() {
        const encoder = new TextEncoder();
        const original = encoder.encode(str).buffer;
        const compressed = CompressionUtils.compress(original);
        console.log(`original length: ${original.byteLength}, compressed length: ${compressed.byteLength}`)
        assert.isBelow(compressed.byteLength, original.byteLength);
    });

    it("should recover original string when decompressing", function() {
        const encoder = new TextEncoder();
        const original = encoder.encode(str).buffer;
        const compressed = CompressionUtils.compress(original);
        const decompressed = CompressionUtils.decompress(compressed);
        const decoder = new TextDecoder();
        assert.equal(decoder.decode(decompressed), str);
    });
});