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

    const fakeId = "FAKE_ID";

    let runCount = 0;

    const parentTaskLabel = "l1";
    const childTaskLabel = "l2";
    const childTaskLabel2 = "l3";
    let parentTask: Task<TaskType.TEST_TASK>,
        childTask: Task<TaskType.TEST_TASK>,
        noLabelParentTask: Task<TaskType.TEST_TASK>,
        noLabelChildTask: Task<TaskType.TEST_TASK>,
        labelledChildWithNoLabelParent: Task<TaskType.TEST_TASK>,
        secondChildTask: Task<TaskType.TEST_TASK>,
        secondNoLabelChild: Task<TaskType.TEST_TASK>;

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
        noLabelParentTask = taskFactory.createTask(TaskType.TEST_TASK, {});
        noLabelChildTask = taskFactory.createTask(TaskType.TEST_TASK, {
            parent: noLabelParentTask.id
        });
        labelledChildWithNoLabelParent = taskFactory.createTask(TaskType.TEST_TASK, {
            parent: noLabelParentTask.id,
            label: childTaskLabel
        });
        secondChildTask = taskFactory.createTask(TaskType.TEST_TASK, {
            parent: parentTask.id,
            label: childTaskLabel2
        });
        secondNoLabelChild = taskFactory.createTask(TaskType.TEST_TASK, {
            parent: noLabelParentTask.id
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

    it("should create a task with label, and can retrieve the task by id", function () {
        taskService.create(parentTask);
        const task = taskService.getById(parentTask.id);
        assert.equal(task, parentTask);
    });

    it("should be able to get the other task by label when the first is terminated", function () {
        taskService.create(parentTask);
        taskService.create(childTask);
        taskService.create(secondChildTask);
        taskService.terminate(childTask.id);
        assert.equal(taskService.getByLabel(childTaskLabel2, parentTask.id), secondChildTask);
    });

    it("two tasks with no label under same parent can exist independently", function () {
        taskService.create(noLabelParentTask);
        taskService.create(noLabelChildTask);
        taskService.create(secondNoLabelChild);
        assert.sameOrderedMembers(
            [taskService.getById(noLabelChildTask.id), taskService.getById(secondNoLabelChild.id)],
            [noLabelChildTask, secondNoLabelChild]
        );
    });

    it("two tasks with no label under same parent can be deleted independently", function () {
        taskService.create(noLabelParentTask);
        taskService.create(noLabelChildTask);
        taskService.create(secondNoLabelChild);
        taskService.terminate(noLabelChildTask.id);
        assert.sameOrderedMembers(
            [taskService.getById(noLabelChildTask.id), taskService.getById(secondNoLabelChild.id)],
            [undefined, secondNoLabelChild]
        );
    });

    it("should create a task with label, and can retrieve the task by label", function () {
        taskService.create(parentTask);
        const task = taskService.getByLabel(parentTask.label!);
        assert.equal(task, parentTask);
    });

    it("should create a task without label, and retrieve with id", function () {
        taskService.create(noLabelParentTask);
        const task = taskService.getById(noLabelParentTask.id);
        assert.equal(task, noLabelParentTask);
    });

    it("should create a task label and with parent, and retrieve with label", function () {
        taskService.create(noLabelParentTask);
        taskService.create(labelledChildWithNoLabelParent);
        const task = taskService.getByLabel(labelledChildWithNoLabelParent.label!, noLabelParentTask.id);
        assert.equal(task, labelledChildWithNoLabelParent);
    });

    it("should start a task", function () {
        taskService.create(parentTask);
        taskService.start(parentTask.id);
        assert.isTrue(taskService.isRunning(parentTask.id));
    });

    it("should report a non-existent task as not running", function () {
        assert.isFalse(taskService.isRunning(fakeId));
    });

    it("should throw if trying to remove non-existing task", function () {
        assert.throws(() => taskService.terminate(fakeId));
    });

    it("should terminate a task with no label", function () {
        taskService.create(noLabelParentTask);
        taskService.create(noLabelChildTask);
        taskService.create(labelledChildWithNoLabelParent);
        taskService.start(noLabelParentTask.id);
        taskService.start(noLabelChildTask.id);
        taskService.start(labelledChildWithNoLabelParent.id);
        taskService.terminate(noLabelParentTask.id);
        assert.isFalse(
            taskService.isRunning(noLabelParentTask.id) ||
                taskService.isRunning(noLabelChildTask.id) ||
                taskService.isRunning(labelledChildWithNoLabelParent.id)
        );
        assert.throws(() => taskService.start(noLabelParentTask.id));
        assert.throws(() => taskService.start(noLabelChildTask.id));
        assert.throws(() => taskService.start(labelledChildWithNoLabelParent.id));
    });

    it("should terminate a task with label and its child tasks", function () {
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
