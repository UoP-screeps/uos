export class CircularArray<T> implements Iterable<T> {
    private readonly arr: T[];
    private curr: number;
    constructor(size: number) {
        this.arr = new Array(size);
        this.curr = 0;
    }

    push(...values: T[]): void {
        values.forEach((value: T) => {
            this.arr[this.curr] = value;
            this.curr = increment(this.curr, this.arr.length);
        });
    }

    [Symbol.iterator](): CircularArrayIterator<T> {
        return new CircularArrayIterator(this.arr, this.curr);
    }
}

class CircularArrayIterator<T> implements Iterator<T> {
    private readonly arr: T[];
    private readonly start: number;
    private curr: number;
    private done: boolean;

    constructor(arr: T[], start: number) {
        this.arr = arr;
        this.start = start;
        this.curr = start;
        this.done = false;
    }

    next(): IteratorResult<T> {
        if (this.done) {
            return {
                value: undefined,
                done: true
            };
        }
        this.curr = decrement(this.curr, this.arr.length);
        const value = this.arr[this.curr];
        this.done = this.curr === this.start;
        return {
            value: value,
            done: value === undefined
        };
    }
}

function increment(n: number, total: number): number {
    return n >= total - 1 ? 0 : n + 1;
}

function decrement(n: number, total: number): number {
    return n > 0 ? n - 1 : total - 1;
}
