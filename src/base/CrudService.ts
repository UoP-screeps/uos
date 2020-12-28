export abstract class CrudService<T> {
    abstract create(item: T): DbItem<T>;
    createAll(...items: T[]): DbItem<T>[] {
        return items.map((v) => this.create(v));
    }

    abstract delete(dbid: string): void;

    abstract modify(item: DbItem<T>): void;

    abstract get(dbid: string): DbItem<T>;
}