import { AbstractTask } from "../AbstractTask";
import { TaskTypeConstant } from "../../TaskConstants";

const type = TaskTypeConstant.SAMPLE_TASK;

export class SampleTask extends AbstractTask<typeof type>{

    get type(): typeof type{
        return type;
    }

    run(): void {
        console.log("Task is running!");
        return;
    }

}