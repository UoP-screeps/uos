type Optional<T> = T | undefined;
type Nullable<T> = T | undefined | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyArgs = any[];

interface Memory {
    id?: number;
}

type DbItem<T> = {
    dbid: string;
} & T

type Pos = {
    roomName: string;
} & RoomPos;

type RoomPos = {
    x: number;
    y: number;
}

type Request<S=undefined, F=undefined> = {
    success: true;
    data: S;
} | {
    success: false;
    data: F;
}

