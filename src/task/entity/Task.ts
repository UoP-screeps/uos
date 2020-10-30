import { TaskType } from "../TaskConstants";
import { makeId } from "../../utils/Id";
import { TaskService } from "../TaskService";
import { Inject } from "typescript-ioc";

export abstract class Task<T extends TaskType = TaskType> {

    private readonly _id: string;

    private readonly _label?: string;

    @Inject
    private readonly taskService!: TaskService;

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

    suspend(): void {
        return;
    }

    continue(): void {
        return;
    }
}