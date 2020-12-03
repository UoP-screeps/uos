import { Task } from "../Task";
import { TaskType } from "../../TaskConstants";
import { TaskDef } from "../../Decorator";

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