import { Task, TaskConstructor } from "./entity/Task";
import { TaskType } from "./TaskConstants";
import { Singleton } from "typescript-ioc";
import ObjectUtils from "../utils/ObjectUtils";

@Singleton
export default class TaskFactory {
    private readonly types: { [key in TaskType]?: Constructor<Task> };

    constructor() {
        this.types = {};
    }

    register<T extends TaskType>(type: TaskConstructor<T>): void {
        this.types[type.prototype.type] = type;
    }

    createTask<T extends TaskType>(
        type: T,
        opts?: {
            parent?: string;
            label?: string;
        }
    ): Task<T> {
        const taskConstructor = this.types[type];
        if (taskConstructor == undefined) {
            throw new Error(`Unknown type ${type}`);
        }
        return new (taskConstructor as TaskConstructor<T>)(opts);
    }

    /**
     * Used in tests to clear the task factory
     */
    clear(): void {
        ObjectUtils.removeAll(this.types);
    }
}
