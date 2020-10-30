import { TaskType } from "./TaskConstants";
import { Task } from "./entity/Task";
import { Container, Scope } from "typescript-ioc";

export abstract class TaskService {
    abstract create(task: Task): void;

    abstract start(id: string): void ;

    abstract terminate(id: string): void;

    abstract suspend(id: string): void;

    abstract continue(id: string): void;
}

class TaskServiceImpl extends TaskService {

    private readonly tasks: { [id: string]: TaskEntry };

    constructor() {
        super();
        this.tasks = {};
    }

    create(task: Task): void {
        this.tasks[task.id] = {
            task: task,
            state: TaskState.INITIAL
        };
    }

    start(id: string): void {
        if (!(id in this.tasks)) {
            throw Error(`Task ${id} not found!`);
        }
        this.tasks[id].state = TaskState.ACTIVE;
    }

    terminate(id: string): void {
        if (!(id in this.tasks)) {
            throw Error(`Task ${id} not found!`);
        }
        delete this.tasks[id];
    }

    suspend(id: string): void {
        if (!(id in this.tasks)) {
            throw Error(`Task ${id} not found!`);
        }
        this.tasks[id].state = TaskState.SUSPENDED;
    }

    continue(id: string): void {
        if (!(id in this.tasks)) {
            throw Error(`Task ${id} not found!`);
        }
        this.tasks[id].state = TaskState.ACTIVE;
    }

}

Container.bind(TaskService).to(TaskServiceImpl).scope(Scope.Singleton);

interface TaskEntry {
    task: Task;
    state: TaskState;
}

enum TaskState {
    INITIAL = "initial",
    SUSPENDED = "suspended",
    ACTIVE = "active"
}