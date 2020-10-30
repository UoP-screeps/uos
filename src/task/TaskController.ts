import { Inject, Singleton } from "typescript-ioc";
import { Task } from "./entity/Task";
import { TaskType } from "./TaskConstants";
import { TaskService } from "./TaskService";

@Singleton
export default class TaskController {
    @Inject
    private taskService!: TaskService;

    private readonly types: { [key in TaskType]?: Constructor<Task> };

    constructor() {
        this.types = {};
    }


    register(type: Constructor<Task>): void {
        const instance = new type();
        const typeName = instance.type;
        this.types[typeName] = type;
    }

    createTask<T extends TaskType>(taskType: T, parent?: string): Task<T>{
        // TODO unimplemented
        const taskConstructor = this.types[taskType];
        if(taskConstructor == undefined) {
            throw new Error();
        }
        return new (taskConstructor as Constructor<Task<T>>)();
    }
    createTaskByLabel<T extends TaskType>(taskType: T, label: string, parent?: string): Task<T> {
        // TODO unimplemented
        const taskConstructor = this.types[taskType];
        if(taskConstructor == undefined) {
            throw new Error();
        }
        return new (taskConstructor as Constructor<Task<T>>)(label);
    }
    getTask<T extends TaskType>(id: string): Task<T> {
        throw new Error();
    }
    getTaskByLabel<T extends TaskType>(label: string) : Task<T> & {readonly label: string} {
        throw new Error();
    }

}
