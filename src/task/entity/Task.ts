import { TaskType } from "../TaskConstants";
import { makeId } from "../../utils/Id";
import TaskController from "../TaskController";
import { Container } from "typescript-ioc";

export abstract class Task<T extends TaskType = TaskType> {

    private taskController: TaskController;

    private readonly _id: string;

    private readonly _label?: string;

    constructor(label?: string) {
        this._id = makeId();
        this._label = label;
        this.taskController = Container.get(TaskController);
        this.taskController.register(this);
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