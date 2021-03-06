/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ObjectUtils {
    static removeAll(obj: Record<string, any>): void {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                delete obj[key];
            }
        }
    }

    static isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0;
    }
}