import { TaskType } from "../TaskConstants";
import { AbstractTask } from "../entity/AbstractTask";

export abstract class TaskService {
    abstract createTask<T extends TaskType>(taskType: T, parent?: string): AbstractTask<T>;
    abstract createTaskByLabel<T extends TaskType>(taskType: T, label: string, parent?: string): AbstractTask<T>;
    abstract getTask<T extends TaskType>(id: string): AbstractTask<T>;
    abstract getTaskByLabel<T extends TaskType>(label: string) : AbstractTask<T> & {readonly label: string};
}