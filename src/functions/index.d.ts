type Predicate<T> = (t: T) => boolean;
type UnaryFunction<T, R> = (t: T) => R;
type UnaryOperator<T> = (t: T) => T;
type Constructor<T> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new(...args: any[]): T;
    prototype: T;
};