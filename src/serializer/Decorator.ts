/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * A table
 */
export const Table = function<T extends { new(...args: any[]): {} }> (target: T) : T {
    return class extends target {
        $tableType: T;
        constructor(...args: any[]) {
            super(args);
            this.$tableType = target;
        }
    };
};
/* eslint-enable @typescript-eslint/no-explicit-any */