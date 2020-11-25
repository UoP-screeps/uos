export abstract class DataService {
    /**
     * create a collection with given name and type
     * @param name name of the collection
     * @throws Error if the collection cannot be created
     */
    abstract createCollection(name: string): void;

    /**
     * gets a collection with given name and type.
     * @param name name of the collection
     * @return the collection
     * @throws Error if the collection does not exist
     */
    abstract getCollection<T>(name: string): Collection<T>;

    abstract exists(name: string): boolean;
}

export abstract class Collection<T> {
    /**
     * get name of the collection
     * @return name of collection
     */
    abstract getName(): string;

    /**
     * rename the collection
     * @param name new name for the collection
     * @throws Error if the collection name already exists
     */
    abstract renameCollection(name: string): void;

    abstract count(condition?: Predicate<T>): number;

    abstract createIndex(...key: (keyof T)[]): void;

    abstract dropIndex(...key: (keyof T)[]): void;

    abstract list(condition?: Predicate<T>): T[];

    abstract delete(condition?: Predicate<T>): void;

    abstract update(condition: Predicate<T>, replacement: UnaryOperator<T>): void;
}