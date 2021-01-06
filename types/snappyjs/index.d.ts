declare module "snappyjs" {
    function compress<T extends ArrayBuffer | Buffer | Uint8Array>(buffer: T): T;
    function uncompress<T extends ArrayBuffer | Buffer | Uint8Array>(compressed: T): T;
    export {compress, uncompress};
}