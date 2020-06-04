export function nonNull<T>(object: T | null | undefined): T {
    if (object === undefined || object === null) {
        throw TypeError(`Assert nonnull failed`);
    }
    return object;
}