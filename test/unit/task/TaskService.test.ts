import { TaskService } from "../../../src/task/TaskService";
import { Container } from "typescript-ioc";
import TaskFactory from "../../../src/task/TaskFactory";
import { TaskDef } from "../../../src/task/Decorator";
import { TaskType } from "../../../src/task/TaskConstants";
import { Task } from "../../../src/task/entity/Task";
import { assert } from "chai";

describe("TaskService", function () {
    const taskService = Container.get(TaskService);
    const taskFactory = Container.get(TaskFactory);

    let runCount = 0;

    const parentTaskLabel = "l1";
    const childTaskLabel = "l2";
    let parentTask: Task<TaskType.TEST_TASK>, childTask: Task<TaskType.TEST_TASK>;

    before(function () {
        taskService.reset();
        taskFactory.clear();

        @TaskDef
        class TestTask extends Task<TaskType.TEST_TASK> {
            run(): void {
                runCount++;
            }

            get type(): TaskType.TEST_TASK {
                return TaskType.TEST_TASK;
            }
        }

        parentTask = taskFactory.createTask(TaskType.TEST_TASK, {
            label: parentTaskLabel
        });
        childTask = taskFactory.createTask(TaskType.TEST_TASK, {
            parent: parentTask.id,
            label: childTaskLabel
        });
    });

    beforeEach(function () {
        runCount = 0;
    });

    afterEach(function () {
        taskService.reset();
    });

    after(function () {
        taskService.reset();
        taskFactory.clear();
    });

    it("should create a task, and can retrieve the task by id", function () {
        taskService.create(parentTask);
        const task = taskService.getById(parentTask.id);
        assert.equal(task, parentTask);
    });

    it("should create a task, and can retrieve the task by label", function () {
        taskService.create(parentTask);
        const task = taskService.getByLabel(parentTask.label!);
        assert.equal(task, parentTask);
    });

    it("should start a task", function () {
        taskService.create(parentTask);
        taskService.start(parentTask.id);
        assert.isTrue(taskService.isRunning(parentTask.id));
    });

    it("should terminate a task and its child tasks", function () {
        taskService.create(parentTask);
        taskService.create(childTask);
        taskService.start(parentTask.id);
        taskService.start(childTask.id);
        taskService.terminate(parentTask.id);
        assert.isFalse(taskService.isRunning(parentTask.id) || taskService.isRunning(childTask.id));
        assert.throws(function () {
            taskService.start(parentTask.id);
        });
        assert.throws(function () {
            taskService.start(childTask.id);
        });
    });

    it("should suspend a task properly", function () {
        taskService.create(parentTask);
        taskService.create(childTask);
        taskService.start(parentTask.id);
        taskService.start(childTask.id);
        taskService.suspend(parentTask.id);
        assert.deepEqual([taskService.isRunning(parentTask.id), taskService.isRunning(childTask.id)], [false, true]);
        assert.doesNotThrow(function () {
            taskService.continue(parentTask.id);
        });
    });

    it("should run all active tasks", function () {
        taskService.create(parentTask);
        taskService.create(childTask);
        taskService.start(parentTask.id);
        taskService.run();
        assert.equal(runCount, 1);
    });

    it("should throw if trying to create a task with same label under same parent", function () {
        taskService.create(parentTask);
        const sameLabelTask = taskFactory.createTask(TaskType.TEST_TASK, {
            label: parentTaskLabel
        });
        assert.throws(function () {
            taskService.create(sameLabelTask);
        });
    });

    it("should not throw if creating task with same label but different parent", function () {
        taskService.create(parentTask);
        const differentParentTask = taskFactory.createTask(TaskType.TEST_TASK, {
            parent: parentTask.id,
            label: parentTaskLabel
        });
        assert.doesNotThrow(function () {
            taskService.create(differentParentTask);
        });
    });
});
