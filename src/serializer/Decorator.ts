export const $tableType = Symbol("$tableType");

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A table
 */
export const Persistent = function<T extends { new(...args: any[]): {} }> (target: T) : T {
    return class extends target {
        [$tableType]: T;
        constructor(...args: any[]) {
            super(args);
            this[$tableType] = target;
            Object.defineProperty(this, $tableType, {
                value: target,
                enumerable: false
            });
        }
    };
};

export type TableType<T> = T
    & {[$tableType]: {new (...args: any[]):T}}
/* eslint-enable @typescript-eslint/no-explicit-any */