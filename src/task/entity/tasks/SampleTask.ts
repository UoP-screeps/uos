import { TaskType } from "../../TaskConstants";
import { TaskDef } from "../../Decorator";
import { Task } from "../Task";

@TaskDef
export class SampleTask extends Task<TaskType.SAMPLE_TASK> {
    get type(): TaskType.SAMPLE_TASK {
        return TaskType.SAMPLE_TASK;
    }

    run(): void {
        console.log("Task is running!");
        return;
    }
}
