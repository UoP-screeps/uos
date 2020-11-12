import { Container } from "typescript-ioc";
import { Task } from "../../../src/task/entity/Task";
import { TaskType } from "../../../src/task/TaskConstants";
import TaskFactory from "../../../src/task/TaskFactory";
import { assert } from "chai";

describe("TaskFactory", function() {
    const taskFactory = Container.get(TaskFactory);
    before(function() {
        taskFactory.clear();
    });

    beforeEach(function() {
        class TestTask extends Task<TaskType.TEST_TASK> {
            run(): void {
                return;
            }

            get type(): TaskType.TEST_TASK {
                return TaskType.TEST_TASK;
            }
        }

        taskFactory.register(TestTask);
    });

    after(function() {
        taskFactory.clear();
    });

    it("should register a task and be able to create one of the type", function() {
        assert.exists(taskFactory.createTask(TaskType.TEST_TASK));
    });

    it("should clear the factory", function() {
        const taskFactory = Container.get(TaskFactory);
        taskFactory.clear();
        assert.throws(function () {
            taskFactory.createTask(TaskType.TEST_TASK)
        });
    });

    it("should create a correct instance of Task", function() {
        const parent = "parent";
        const label = "label";
        const task = taskFactory.createTask(TaskType.TEST_TASK, {
            parent, label
        });
        assert.include(task, {
            parentId: parent,
            label: label,
            type: TaskType.TEST_TASK
        });
    });
});