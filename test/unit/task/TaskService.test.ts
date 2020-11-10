import { TaskService } from "../../../src/task/TaskService";
import { Container } from "typescript-ioc";
import TaskFactory from "../../../src/task/TaskFactory";
import { TaskDef } from "../../../src/task/Decorator";
import { TaskType } from "../../../src/task/TaskConstants";
import { Task } from "../../../src/task/entity/Task";
import {assert} from "chai";

describe("TaskService", function() {
    const taskService = Container.get(TaskService);
    const taskFactory = Container.get(TaskFactory);

    let runCount = 0;

    const task1Label = "l1";
    const task2Label = "l2";
    let task1: Task<TaskType.TEST_TASK>, task2: Task<TaskType.TEST_TASK>;

    before(function() {
        taskService.reset();
        taskFactory.clear();
        @TaskDef
        class TestTask extends Task<TaskType.TEST_TASK> {
            run(): void {
                runCount ++;
            }

            get type(): TaskType.TEST_TASK {
                return TaskType.TEST_TASK;
            }
        }

        task1 = taskFactory.createTask(TaskType.TEST_TASK, {
            label: task1Label
        });
        task2 = taskFactory.createTask(TaskType.TEST_TASK, {
            parent: task1.id,
            label: task2Label
        });

    });

    beforeEach(function() {
        runCount = 0;
    });

    afterEach(function() {
        taskService.reset();
    });

    after(function() {
        taskService.reset();
        taskFactory.clear();
    })

    it("should create a task, and can retrieve the task by id", function() {
        taskService.create(task1);
        const task = taskService.getById(task1.id);
        assert.equal(task, task1);
    });

    it("should create a task, and can retrieve the task by label", function() {
        taskService.create(task1);
        const task = taskService.getByLabel(task1.label!);
        assert.equal(task, task1);
    });

    it("should start a task", function() {
        taskService.create(task1);
        taskService.start(task1.id);
        assert.isTrue(taskService.isRunning(task1.id));
    });

    it("should terminate a task and its child tasks", function() {
        taskService.create(task1);
        taskService.create(task2);
        taskService.start(task1.id);
        taskService.start(task2.id);
        taskService.terminate(task1.id);
        assert.isFalse(taskService.isRunning(task1.id) || taskService.isRunning(task2.id));
        assert.throws(function() {
            taskService.start(task1.id);
        });
        assert.throws(function() {
            taskService.start(task2.id);
        });
    });

    it("should suspend a task properly", function() {
        taskService.create(task1);
        taskService.create(task2);
        taskService.start(task1.id);
        taskService.start(task2.id);
        taskService.suspend(task1.id);
        assert.deepEqual([taskService.isRunning(task1.id), taskService.isRunning(task2.id)], [false, true]);
        assert.doesNotThrow(function() {
            taskService.continue(task1.id);
        });
    });

    it("should run all active tasks", function() {
        taskService.create(task1);
        taskService.create(task2);
        taskService.start(task1.id);
        taskService.run();
        assert.equal(runCount, 1);
    });
});