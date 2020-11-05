import { Task } from "./entity/Task";
import { Container, Scope } from "typescript-ioc";
import { TaskType } from "./TaskConstants";
import ObjectUtils from "../utils/ObjectUtils";

export abstract class TaskService {
    abstract run(): void;

    abstract create(task: Task): void;

    abstract start(id: string): void;

    abstract terminate(id: string): void;

    abstract suspend(id: string): void;

    abstract continue(id: string): void;

    abstract getById(id: string): Nullable<Task>;

    abstract getByLabel<T extends TaskType>(label: string, parent?: string): Nullable<Task<T>>;

    abstract isRunning(id: string): boolean;
    /**
     * only use in tests to reset the service
     */
    abstract reset(): void;
}

class TaskServiceImpl extends TaskService {
    private readonly tasks: { [id: string]: TaskEntry };

    static readonly ROOT_KEY = Symbol("root");

    static readonly NO_LABEL = Symbol("no_label");

    private readonly taskIndex: {
        [parent: string] : ParentStructure
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
        return task as Task<T> & { label: string };
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
        const parentIndex = TaskServiceImpl.getParentIndex(task.parent);
        const index = this.taskIndex;
        const parentObj = index[parentIndex] = index[parentIndex] || {};
        if(label) {
            parentObj[label] = task.id;
        } else {
            const taskTable = parentObj[TaskServiceImpl.NO_LABEL] = parentObj[TaskServiceImpl.NO_LABEL] || {};
            taskTable[task.id] = true;
        }
    }

    private removeInternal(id: string): void {
        if (!(id in this.tasks)) {
            throw Error(`Task ${id} not found!`);
        }

        this.removeFromIndex(this.tasks[id].task);

        delete this.tasks[id];
    }

    private removeFromIndex(task: Task): void {
        const label = task.label;
        const parentIndex = TaskServiceImpl.getParentIndex(task.parent);
        const index = this.taskIndex;
        const parentObj = index[parentIndex];
        if(!parentObj) {
            return;
        }
        if(label) {
            delete parentObj[label];
            if(ObjectUtils.isEmpty(parentObj)) {
                delete index[parentIndex];
            }
        } else {
            const taskTable = parentObj[TaskServiceImpl.NO_LABEL];
            if(!taskTable) {
                return;
            }
            delete taskTable[task.id];
            if(ObjectUtils.isEmpty(taskTable)) {
                delete parentObj[TaskServiceImpl.NO_LABEL];
            }
        }
    }

    private getChildren(parentId?: string): string[] {
        const parentKey = parentId || TaskServiceImpl.ROOT_KEY;
        const list = this.taskIndex[parentKey];
        if(!list) {
            return [];
        }
        const result = Object.keys(list[TaskServiceImpl.NO_LABEL] || {});
        result.push(...Object.values(list));
        return result;
    }

    private changeState(id: string, state: TaskState): void {
        if (!(id in this.tasks)) {
            throw Error(`Task ${id} not found!`);
        }
        this.tasks[id].state = state;
    }

    private static getParentIndex(parent: Nullable<string>): string | typeof TaskServiceImpl.ROOT_KEY{
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
}
}

enum TaskState {
    INITIAL = "initial",
    SUSPENDED = "suspended",
    ACTIVE = "active"
}

function isRunning(taskEntry: TaskEntry): boolean {
    return taskEntry.state === TaskState.ACTIVE;
}
