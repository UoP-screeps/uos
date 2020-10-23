type Optional<T> = T | undefined;
type Nullable<T> = T | undefined | null;

type TableType<T> = T & {$tableType: {new (...args: any[]):T}}

interface Memory {
    id?: number;
}