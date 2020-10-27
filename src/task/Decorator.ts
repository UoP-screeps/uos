
export const Task = function<T extends Constructor> (target: T) : T {
    return class extends target {
        constructor(...args: AnyArgs) {
            // TODO
            super(args);
        }
    };
};