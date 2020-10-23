export default abstract class Mapper<T> {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    abstract init(): void;
}

class MapperImpl<T> extends Mapper<T> {
    init(): void {
        // do nothing
    }
}