import { TaskType } from "../TaskConstants";
import { Task } from "../entity/Task";

export abstract class TaskService {
    abstract createTask<T extends TaskType>(taskType: T, parent?: string): Task<T>;
    abstract createTaskByLabel<T extends TaskType>(taskType: T, label: string, parent?: string): Task<T>;
    abstract getTask<T extends TaskType>(id: string): Task<T>;
    abstract getTaskByLabel<T extends TaskType>(label: string) : Task<T> & {readonly label: string};
}