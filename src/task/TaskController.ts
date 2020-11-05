import { Inject, Singleton } from "typescript-ioc";
import { Task } from "./entity/Task";
import { TaskType } from "./TaskConstants";
import { TaskService } from "./TaskService";
import TaskFactory from "./TaskFactory";

@Singleton
export default class TaskController {
    @Inject
    private taskService!: TaskService;

    @Inject
    private taskFactory!: TaskFactory;

    createTask<T extends TaskType>(taskType: T, parent?: string): Task<T> {
        const task = this.taskFactory.createTask(taskType, { parent });
        this.taskService.create(task);
        return task;
    }
    createTaskByLabel<T extends TaskType>(taskType: T, label: string, parent?: string): Task<T> {
        const task = this.taskFactory.createTask(taskType, { label, parent });
        this.taskService.create(task);
        return task;
    }
    getTask<T extends TaskType>(id: string): Nullable<Task<T>> {
        return this.taskService.getById(id) as Nullable<Task<T>>;
    }
    getTaskByLabel<T extends TaskType>(label: string, parent?: string): Nullable<Task<T> & { readonly label: string }> {
        return this.taskService.getByLabel(label, parent) as Nullable<Task<T> & { readonly label: string }>;
    }
}
