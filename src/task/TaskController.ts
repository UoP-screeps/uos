import { Inject, Singleton } from "typescript-ioc";
import { Task } from "./entity/Task";
import { TaskType } from "./TaskConstants";
import { TaskService } from "./TaskService";
import TaskFactory from "./TaskFactory";

@Singleton
export default class TaskController {
    private taskService: TaskService;

    private taskFactory: TaskFactory;

    // noinspection JSUnusedGlobalSymbols
    constructor(@Inject taskService: TaskService, @Inject taskFactory: TaskFactory) {
        this.taskService = taskService;
        this.taskFactory = taskFactory;
    }

    /**
     * 创建一个任务
     * @param taskType 任务类型
     * @param parent 父任务的id
     */
    createTask<T extends TaskType>(taskType: T, parent?: string): Task<T> {
        const task = this.taskFactory.createTask(taskType, { parent });
        this.taskService.create(task);
        return task;
    }

    /**
     * 使用标签创建一个任务
     * @param taskType 任务类型
     * @param label 任务标签
     * @param parent 父任务
     */
    createTaskByLabel<T extends TaskType>(taskType: T, label: string, parent?: string): Task<T> {
        const task = this.taskFactory.createTask(taskType, { label, parent });
        this.taskService.create(task);
        return task;
    }

    /**
     * 用id获取一个任务
     * @param id 任务的id
     */
    getTask<T extends TaskType>(id: string): Nullable<Task<T>> {
        return this.taskService.getById(id) as Nullable<Task<T>>;
    }

    /**
     * 用标签获取一个任务
     * @param label 任务的标签
     * @param parent 父任务的id
     */
    getTaskByLabel<T extends TaskType>(label: string, parent?: string): Nullable<Task<T> & { readonly label: string }> {
        return this.taskService.getByLabel(label, parent) as Nullable<Task<T> & { readonly label: string }>;
    }
}
