import { Container } from "typescript-ioc";
import { Task } from "../../../src/task/entity/Task";
import { TaskType } from "../../../src/task/TaskConstants";
import TaskFactory from "../../../src/task/TaskFactory";
import { assert } from "chai";
import { TaskDef } from "../../../src/task/Decorator";

describe("Decorator", function() {
    const taskFactory = Container.get(TaskFactory);

    before(function() {
        taskFactory.clear();
    });

    it("should register a task with TaskDef", function() {
        @TaskDef
        class TestTask extends Task<TaskType.TEST_TASK> {
            run(): void {
                return;
            }

            get type(): TaskType.TEST_TASK {
                return TaskType.TEST_TASK;
            }
        }

        assert.exists(taskFactory.createTask(TaskType.TEST_TASK))
    });

    after(function() {
        taskFactory.clear();
    });


});