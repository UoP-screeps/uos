import {assert} from "chai";
import { TaskService } from "../../../src/task/service/TaskService";
import { Container } from "typescript-ioc";
import { TaskTypeConstant } from "../../../src/task/TaskConstants";
import { AbstractTask } from "../../../src/task/entity/AbstractTask";
import { Task } from "../../../src/task/Decorator";

describe("task service", function() {
    it("should create a task", function() {
        const taskType = TaskTypeConstant.TEST_TASK;

        @Task
        class TestTask extends AbstractTask<typeof taskType> {
            run(): void {
                return;
            }

            get type(): typeof taskType {
                return taskType;
            }
        }

        const taskService = Container.get(TaskService);
        const task = taskService.createTask(TaskTypeConstant.TEST_TASK) as TestTask;
        assert.equal(task.type, taskType);
    });
});