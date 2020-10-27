import { TaskType } from "../TaskConstants";
import { makeId } from "../../utils/Id";

export abstract class AbstractTask<T extends TaskType = TaskType> {

    private readonly _id: string;

    private readonly _label?: string;

    constructor(label?: string) {
        this._id = makeId();
        this._label = label;
    }

    get id(): string {
        return this._id;
    }

    get label(): Optional<string> {
        return this._label;
    }

    abstract get type(): T;

    start(): void {
        return;
    }

    abstract run(): void;

    terminate(): void {
        return;
    }
}