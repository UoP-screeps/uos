import { TaskType } from "../TaskConstants";
import { makeId } from "../../utils/Id";
import { TaskService } from "../TaskService";
import { Container } from "typescript-ioc";

export abstract class Task<T extends TaskType = TaskType> {
    private readonly _id: string;

    private readonly _label?: string;

    private readonly _parent?: string;

    abstract get type(): T;

    protected readonly taskService: TaskService;

    constructor(opt?: { label?: string; parent?: string }) {
        this._id = makeId();
        this._label = opt?.label;
        this._parent = opt?.parent;
        this.taskService = Container.get(TaskService);
    }

    get id(): string {
        return this._id;
    }

    get label(): Optional<string> {
        return this._label;
    }

    get parent(): Optional<string> {
        return this._parent;
    }

    start(): void {
        this.taskService.start(this.id);
    }

    abstract run(): void;

    terminate(): void {
        this.taskService.terminate(this.id);
    }

    suspend(): void {
        this.taskService.suspend(this.id);
    }

    continue(): void {
        this.taskService.continue(this.id);
    }

    isRunning(): boolean {
        return this.taskService.isRunning(this.id);
    }
}

export interface TaskConstructor<T extends TaskType = TaskType> extends Constructor<Task<T>> {
    new (opt?: { label?: string; parent?: string }): Task<T>;
}
