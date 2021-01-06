import { assert } from "chai";
import Base64Utils from "../../../src/utils/Base64Utils";
import { TextDecoder, TextEncoder } from "util";

describe("Base64 Util", function() {
    it("should encode bytes of length 6 correctly", function() {
        const textEncoder = new TextEncoder();
        const encodedString = textEncoder.encode("abcdef");
        const result = Base64Utils.encode(encodedString);
        assert.equal(result, "YWJjZGVm");
    });
    it("should encode bytes of length 7 correctly", function() {
        const textEncoder = new TextEncoder();
        const encodedString = textEncoder.encode("abcdefg");
        const result = Base64Utils.encode(encodedString);
        assert.equal(result, "YWJjZGVmZw==");
    });
    it("should encode bytes of length 8 correctly", function() {
        const textEncoder = new TextEncoder();
        const encodedString = textEncoder.encode("abcdefgh");
        const result = Base64Utils.encode(encodedString);
        assert.equal(result, "YWJjZGVmZ2g=");
    });
    it("should encode empty bytes correctly", function() {
        const result = Base64Utils.encode(new ArrayBuffer(0));
        assert.equal(result, "");
    });
    it("should encode random long strings correctly", function() {
        const str = "The specific set of characters chosen for the 64 characters needed for the base can vary among implementations. The common concept is to select a set of 64 characters that is both part of a subset typical to most encodings. This mixture leaves the data impossible to be altered in transportation thru information systems, such as electronic mail, that were typically not 8-bit clean. The Base64 implementation in MIME uses a-z, A-Z and 0-9 for the first 62 values. Other Base64 variations share the same property but they use different symbols in the last two values."
        const expected = "VGhlIHNwZWNpZmljIHNldCBvZiBjaGFyYWN0ZXJzIGNob3NlbiBmb3IgdGhlIDY0IGNoYXJhY3RlcnMgbmVlZGVkIGZvciB0aGUgYmFzZSBjYW4gdmFyeSBhbW9uZyBpbXBsZW1lbnRhdGlvbnMuIFRoZSBjb21tb24gY29uY2VwdCBpcyB0byBzZWxlY3QgYSBzZXQgb2YgNjQgY2hhcmFjdGVycyB0aGF0IGlzIGJvdGggcGFydCBvZiBhIHN1YnNldCB0eXBpY2FsIHRvIG1vc3QgZW5jb2RpbmdzLiBUaGlzIG1peHR1cmUgbGVhdmVzIHRoZSBkYXRhIGltcG9zc2libGUgdG8gYmUgYWx0ZXJlZCBpbiB0cmFuc3BvcnRhdGlvbiB0aHJ1IGluZm9ybWF0aW9uIHN5c3RlbXMsIHN1Y2ggYXMgZWxlY3Ryb25pYyBtYWlsLCB0aGF0IHdlcmUgdHlwaWNhbGx5IG5vdCA4LWJpdCBjbGVhbi4gVGhlIEJhc2U2NCBpbXBsZW1lbnRhdGlvbiBpbiBNSU1FIHVzZXMgYS16LCBBLVogYW5kIDAtOSBmb3IgdGhlIGZpcnN0IDYyIHZhbHVlcy4gT3RoZXIgQmFzZTY0IHZhcmlhdGlvbnMgc2hhcmUgdGhlIHNhbWUgcHJvcGVydHkgYnV0IHRoZXkgdXNlIGRpZmZlcmVudCBzeW1ib2xzIGluIHRoZSBsYXN0IHR3byB2YWx1ZXMu";
        const textEncoder = new TextEncoder();
        const encodedString = textEncoder.encode(str);
        const result = Base64Utils.encode(encodedString);
        assert.equal(result, expected);
    });

    it("should decode bytes of length 6 correctly", function() {
        const str = "YWJjZGVm";
        const textDecoder = new TextDecoder();
        const decodeResult = Base64Utils.decode(str);
        assert.equal(textDecoder.decode(decodeResult), "abcdef");
        assert.equal(decodeResult.byteLength, 6);
    });

    it("should decode bytes of length 7 correctly", function() {
        const str = "YWJjZGVmZw==";
        const textDecoder = new TextDecoder();
        const decodeResult = Base64Utils.decode(str);
        assert.equal(textDecoder.decode(decodeResult), "abcdefg");
        assert.equal(decodeResult.byteLength, 7);
    });

    it("should decode bytes of length 8 correctly", function() {
        const str = "YWJjZGVmZ2g=";
        const textDecoder = new TextDecoder();
        const decodeResult = Base64Utils.decode(str);
        assert.equal(textDecoder.decode(decodeResult), "abcdefgh");
        assert.equal(decodeResult.byteLength, 8);
    });

    it("should decode empty strings correctly", function() {
        const str = "";
        assert.equal(Base64Utils.decode(str).byteLength, 0);
    });

    it("should decode random long strings correctly", function() {
        const str = "VGhlIHNwZWNpZmljIHNldCBvZiBjaGFyYWN0ZXJzIGNob3NlbiBmb3IgdGhlIDY0IGNoYXJhY3RlcnMgbmVlZGVkIGZvciB0aGUgYmFzZSBjYW4gdmFyeSBhbW9uZyBpbXBsZW1lbnRhdGlvbnMuIFRoZSBjb21tb24gY29uY2VwdCBpcyB0byBzZWxlY3QgYSBzZXQgb2YgNjQgY2hhcmFjdGVycyB0aGF0IGlzIGJvdGggcGFydCBvZiBhIHN1YnNldCB0eXBpY2FsIHRvIG1vc3QgZW5jb2RpbmdzLiBUaGlzIG1peHR1cmUgbGVhdmVzIHRoZSBkYXRhIGltcG9zc2libGUgdG8gYmUgYWx0ZXJlZCBpbiB0cmFuc3BvcnRhdGlvbiB0aHJ1IGluZm9ybWF0aW9uIHN5c3RlbXMsIHN1Y2ggYXMgZWxlY3Ryb25pYyBtYWlsLCB0aGF0IHdlcmUgdHlwaWNhbGx5IG5vdCA4LWJpdCBjbGVhbi4gVGhlIEJhc2U2NCBpbXBsZW1lbnRhdGlvbiBpbiBNSU1FIHVzZXMgYS16LCBBLVogYW5kIDAtOSBmb3IgdGhlIGZpcnN0IDYyIHZhbHVlcy4gT3RoZXIgQmFzZTY0IHZhcmlhdGlvbnMgc2hhcmUgdGhlIHNhbWUgcHJvcGVydHkgYnV0IHRoZXkgdXNlIGRpZmZlcmVudCBzeW1ib2xzIGluIHRoZSBsYXN0IHR3byB2YWx1ZXMu";
        const expected = "The specific set of characters chosen for the 64 characters needed for the base can vary among implementations. The common concept is to select a set of 64 characters that is both part of a subset typical to most encodings. This mixture leaves the data impossible to be altered in transportation thru information systems, such as electronic mail, that were typically not 8-bit clean. The Base64 implementation in MIME uses a-z, A-Z and 0-9 for the first 62 values. Other Base64 variations share the same property but they use different symbols in the last two values."
        const textDecoder = new TextDecoder();
        const decodeResult = Base64Utils.decode(str);
        assert.equal(textDecoder.decode(decodeResult), expected);
    });
});