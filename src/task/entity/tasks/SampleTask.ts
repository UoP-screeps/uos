import { Task } from "../Task";
import { TaskTypeConstant } from "../../TaskConstants";

const type = TaskTypeConstant.SAMPLE_TASK;

export class SampleTask extends Task<typeof type>{

    get type(): typeof type{
        return type;
    }

    run(): void {
        console.log("Task is running!");
        return;
    }

}