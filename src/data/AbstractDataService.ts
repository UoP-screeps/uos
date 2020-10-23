/**
 * Class for saving and
 */
import { Container, Scope } from "typescript-ioc";

export default abstract class AbstractDataService<T> {
    abstract getById(id: number): Optional<T>;
}


class AbstractDataServiceImpl<T> extends AbstractDataService<T> {
    getById(id: number): Optional<T> {
        return undefined;
    }
}

Container.bind(AbstractDataService).to(AbstractDataServiceImpl).scope(Scope.Singleton);