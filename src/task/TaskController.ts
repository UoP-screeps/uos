import { Singleton } from "typescript-ioc";
import { Task } from "./entity/Task";

@Singleton
export default class TaskController {
    private readonly tasks: {[id: string]: TaskEntry};
    constructor() {
        this.tasks = {};
    }

    register(task: Task): void {
        this.tasks[task.id] = {
            task: task,
            state: TaskState.INITIAL
        };
    }

    start(id: string): void {

    }
}

interface TaskEntry {
    task: Task;
    state: TaskState;
}

enum TaskState {
    INITIAL= "initial",
    SUSPENDED = "suspended",
    ACTIVE = "active"
}
