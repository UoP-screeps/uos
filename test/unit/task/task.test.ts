import {assert} from "chai";
import { TaskService } from "../../../src/task/TaskService";
import { Container } from "typescript-ioc";
import { TaskType } from "../../../src/task/TaskConstants";
import { Task } from "../../../src/task/entity/Task";

describe("task service", function() {
    it("should create a task", function() {
        const taskType = TaskType.TEST_TASK;
        class TestTask extends Task<typeof taskType> {
            run(): void {
                return;
            }

            get type(): typeof taskType {
                return taskType;
            }
        }

        const taskService = Container.get(TaskService);
        const task = taskService.createTask(TaskType.TEST_TASK) as TestTask;
        assert.equal(task.type, taskType);
    });
});