import { TaskType } from "../TaskConstants";
import { makeId } from "../../utils/Id";
import { TaskService } from "../TaskService";
import { Container } from "typescript-ioc";

/**
 * 一个抽象的任务类型，所有任务类型的定义都应该继承此类。
 * 定义任务类型的时候，应该在前面加上 @TaskDef 装饰，并且定义所有抽象方法。
 * 注意如果需要自定义构造器的话，参数需要和Task类的相同。
 */
export abstract class Task<T extends TaskType = TaskType> {
    private readonly _id: string;

    private readonly _label?: string;

    private readonly _parentId?: string;

    /**
     * 任务的类型
     */
    abstract get type(): T;

    /**
     * taskService 对象
     * @protected
     */
    protected readonly taskService: TaskService;

    constructor(opt?: { label?: string; parent?: string }) {
        this._id = makeId();
        this._label = opt?.label;
        this._parentId = opt?.parent;
        this.taskService = Container.get(TaskService);
    }

    /**
     * 任务的 id
     */
    get id(): string {
        return this._id;
    }

    /**
     * 任务的标签
     */
    get label(): Optional<string> {
        return this._label;
    }

    /**
     * 父任务的id
     */
    get parentId(): Optional<string> {
        return this._parentId;
    }

    /**
     * 父任务
     */
    get parent(): Nullable<Task> {
        if (this.parentId) {
            return this.taskService.getById(this.parentId);
        }
        return undefined;
    }

    /**
     * 启动任务
     */
    start(): void {
        this.taskService.start(this.id);
    }

    /**
     * 定义任务运行
     */
    abstract run(): void;

    /**
     * 创建子任务
     * @param taskType 子任务的类型
     * @param label 子任务的标签
     */
    create<U extends TaskType>(taskType: TaskConstructor<U>, label?: string): Task<U> {
        const task = new taskType({ label: label, parent: this.id });
        this.taskService.create(task);
        return task;
    }

    /**
     * 结束任务
     */
    terminate(): void {
        this.taskService.terminate(this.id);
    }

    /**
     * 暂停任务
     */
    suspend(): void {
        this.taskService.suspend(this.id);
    }

    /**
     * 继续任务
     */
    continue(): void {
        this.taskService.continue(this.id);
    }

    /**
     * @return 任务是否在运行
     */
    isRunning(): boolean {
        return this.taskService.isRunning(this.id);
    }

    /**
     * 通过标签获取一个子任务
     * @param label 子任务的标签
     */
    getChild<U extends TaskType>(label: string): Nullable<Task<U>> {
        return this.taskService.getByLabel<U>(label, this.id);
    }
}

export interface TaskConstructor<T extends TaskType = TaskType> extends Constructor<Task<T>> {
    new (opt?: { label?: string; parent?: string }): Task<T>;
}
