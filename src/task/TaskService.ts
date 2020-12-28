import { Task } from "./entity/Task";
import { Container, Scope } from "typescript-ioc";
import { TaskType } from "./TaskConstants";
import ObjectUtils from "../utils/ObjectUtils";

export abstract class TaskService {
    /**
     * 运行 TaskService 的所有活跃的任务
     */
    abstract run(): void;

    /**
     * 创建一个任务
     * @param task 需要创建的任务
     * @throws Error 如果task有标签，但是这个标签已经在父任务下存在
     */
    abstract create(task: Task): void;

    /**
     * 开始一个任务
     * @param id 任务的id
     */
    abstract start(id: string): void;

    /**
     * 结束一个任务和他的子任务
     * @param id 任务的id
     */
    abstract terminate(id: string): void;

    /**
     * 暂停一个任务
     * @param id 任务的id
     */
    abstract suspend(id: string): void;

    /**
     * 继续一个暂停的任务
     * @param id 任务的id
     */
    abstract continue(id: string): void;

    /**
     * 通过id获取一个任务
     * @param id 任务的id
     */
    abstract getById(id: string): Nullable<Task>;

    /**
     * 通过标签获取一个任务
     * @param label 标签
     * @param parent 父任务。如果为空则代表是
     */
    abstract getByLabel<T extends TaskType>(label: string, parent?: string): Nullable<Task<T>>;

    /**
     * 判断任务是否正在运行
     * @param id 任务的id
     */
    abstract isRunning(id: string): boolean;
    /**
     * only use in tests to reset the service
     * 不应该在生产环境中使用。在测试环境中用于重置服务。(可以从抽象类中移除？)
     */
    abstract reset(): void;
}

class TaskServiceImpl extends TaskService {
    private readonly tasks: { [id: string]: TaskEntry };

    static readonly ROOT_KEY = Symbol("root");

    static readonly NO_LABEL = Symbol("no_label");

    private readonly taskIndex: {
        [parent: string]: ParentStructure;
    } & {
        [TaskServiceImpl.ROOT_KEY]?: ParentStructure;
    };

    constructor() {
        super();
        this.tasks = {};
        this.taskIndex = {};
    }

    run(): void {
        Object.values(this.tasks).forEach(function (entry) {
            if (isRunning(entry)) {
                entry.task.run();
            }
        });
    }

    create(task: Task): void {
        if (task.label != null && this.getByLabel(task.label, task.parentId)) {
            throw Error(`Create task of type ${task.type} failed. Label ${task.label} already exists.`);
        }
        this.addInternal(task, TaskState.INITIAL);
    }

    start(id: string): void {
        this.changeState(id, TaskState.ACTIVE);
    }

    terminate(id: string): void {
        const children = this.getChildren(id);
        children.forEach((id) => {
            this.terminate(id);
        });
        this.removeInternal(id);
    }

    suspend(id: string): void {
        this.changeState(id, TaskState.SUSPENDED);
    }

    continue(id: string): void {
        this.changeState(id, TaskState.ACTIVE);
    }

    getById<T extends TaskType>(id: string): Nullable<Task<T>> {
        const task = this.tasks[id]?.task;
        return task as Nullable<Task<T>>;
    }

    getByLabel<T extends TaskType>(label: string, parent?: string): Nullable<Task<T>> {
        const parentIndex = TaskServiceImpl.getParentIndex(parent);
        const id = this.taskIndex[parentIndex]?.[label];
        if (!id) {
            return undefined;
        }
        const task = this.getById<T>(id);
        if (!task?.label) {
            return undefined;
        }
        return task;
    }

    isRunning(id: string): boolean {
        return this.tasks[id]?.state === TaskState.ACTIVE;
    }

    reset(): void {
        ObjectUtils.removeAll(this.tasks);
        ObjectUtils.removeAll(this.taskIndex);
    }

    private addInternal(task: Task, state: TaskState): void {
        this.tasks[task.id] = { task, state };
        this.addToIndex(task);
    }

    private addToIndex(task: Task): void {
        const label = task.label;
        const parentIndex = TaskServiceImpl.getParentIndex(task.parentId);
        const index = this.taskIndex;
        const parentObj = (index[parentIndex] ??= {});
        if (label) {
            parentObj[label] = task.id;
        } else {
            const taskTable = (parentObj[TaskServiceImpl.NO_LABEL] ??= {});
            taskTable[task.id] = true;
        }
    }

    private removeInternal(id: string): void {
        const task = this.tasks[id];
        if (task == null) {
            throw Error(`Task ${id} not found!`);
        }

        this.removeFromIndex(task.task);

        delete this.tasks[id];
    }

    private removeFromIndex(task: Task): void {
        const label = task.label;
        const parentIndex = TaskServiceImpl.getParentIndex(task.parentId);
        const index = this.taskIndex;
        const parentObj = index[parentIndex];
        /* istanbul ignore if: should never happen */
        if (!parentObj) {
            return;
        }
        if (label) {
            delete parentObj[label];
            if (ObjectUtils.isEmpty(parentObj)) {
                delete index[parentIndex];
            }
        } else {
            const taskTable = parentObj[TaskServiceImpl.NO_LABEL];
            /* istanbul ignore if: should never happen */
            if (!taskTable) {
                return;
            }
            delete taskTable[task.id];
            if (ObjectUtils.isEmpty(taskTable)) {
                delete parentObj[TaskServiceImpl.NO_LABEL];
            }
        }
    }

    private getChildren(parentId: string): string[] {
        const list = this.taskIndex[parentId];
        if (!list) {
            return [];
        }
        const result = Object.keys(list[TaskServiceImpl.NO_LABEL] || {});
        result.push(...Object.values(list));
        return result;
    }

    private changeState(id: string, state: TaskState): void {
        const task = this.tasks[id];
        if (task == null) {
            throw Error(`Task ${id} not found!`);
        }
        task.state = state;
    }

    private static getParentIndex(parent: Nullable<string>): string | typeof TaskServiceImpl.ROOT_KEY {
        return parent || TaskServiceImpl.ROOT_KEY;
    }
}

Container.bind(TaskService).to(TaskServiceImpl).scope(Scope.Singleton);

interface TaskEntry {
    task: Task;
    state: TaskState;
}

type ParentStructure = {
    [label: string]: string;
} & {
    [TaskServiceImpl.NO_LABEL]?: {
        [id: string]: boolean;
    };
};

enum TaskState {
    INITIAL = "initial",
    SUSPENDED = "suspended",
    ACTIVE = "active"
}

function isRunning(taskEntry: TaskEntry): boolean {
    return taskEntry.state === TaskState.ACTIVE;
}
