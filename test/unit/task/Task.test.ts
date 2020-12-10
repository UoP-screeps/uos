import { Task } from "../../../src/task/entity/Task";
import { TaskType } from "../../../src/task/TaskConstants";
import { Container, Snapshot } from "typescript-ioc";
import { TaskService } from "../../../src/task/TaskService";
import { assert } from "chai";
import { resetGameAndMemory } from "../../mock";

describe("Task", function () {
    let snapshot: Snapshot;
    let called = "";
    let parent: string;
    const label = "label";
    let task: Task<TaskType.TEST_TASK>;
    let parentTask: Task<TaskType.TEST_TASK>;
    let created: Optional<Task>;
    const calledConst = {
        continue: "continue",
        isRunning: "isRunning",
        start: "start",
        create: "create",
        suspend: "suspend",
        terminate: "terminate"
    };

    before(function () {
        // prepare to inject test dependency
        snapshot = Container.snapshot();

        // make sure memory is initialized
        resetGameAndMemory();

        // inject test service implementation
        Container.bind(TaskService).to(
            class TestTaskServiceImpl extends TaskService {
                continue(id: string): void {
                    if (id === task.id) {
                        called = calledConst.continue;
                    }
                }

                create(task: Task): void {
                    called = calledConst.create;
                    created = task;
                }

                getById(id: string): Nullable<Task> {
                    if (id === parent) {
                        return parentTask;
                    }
                    if (id == task.id) {
                        return task;
                    }
                    return undefined;
                }

                getByLabel<T extends TaskType>(label: string, parent?: string): Nullable<Task<T>> {
                    if (label === task.label && parent === parentTask.id) {
                        return task as Task<T>;
                    }
                    throw Error();
                }

                isRunning(id: string): boolean {
                    called = calledConst.isRunning;
                    return true;
                }

                reset(): void {
                    throw Error();
                }

                run(): void {
                    throw Error();
                }

                start(id: string): void {
                    if (id === task.id) {
                        called = calledConst.start;
                    }
                }

                suspend(id: string): void {
                    if (id === task.id) {
                        called = calledConst.suspend;
                    }
                }

                terminate(id: string): void {
                    if (id === task.id) {
                        called = calledConst.terminate;
                    }
                }
            }
        );

        parentTask = new (class extends Task<TaskType.TEST_TASK> {
            run(): void {}

            get type(): TaskType.TEST_TASK {
                return TaskType.TEST_TASK;
            }
        })({ label });
        parent = parentTask.id;
        task = new (class extends Task<TaskType.TEST_TASK> {
            run(): void {}

            get type(): TaskType.TEST_TASK {
                return TaskType.TEST_TASK;
            }
        })({ label, parent });
    });

    beforeEach(function () {
        called = "";
        created = undefined;
    });

    after(function () {
        snapshot.restore(); // discard test dependency
    });

    it("should have an id", function () {
        assert.isDefined(task.id);
    });

    it("should have correct parent", function () {
        assert.equal(task.parentId, parent);
    });

    it("should have correct label", function () {
        assert.equal(task.label, label);
    });

    it("should start correctly by calling start service", function () {
        task.start();
        assert.equal(called, calledConst.start);
    });

    it("should terminate correctly by calling terminate service", function () {
        task.terminate();
        assert.equal(called, calledConst.terminate);
    });

    it("should get result from isRunning", function () {
        task.isRunning();
        assert.equal(called, calledConst.isRunning);
    });

    it("should suspend correctly by calling suspend service", function () {
        task.suspend();
        assert.equal(called, calledConst.suspend);
    });

    it("should continue correctly by calling continue service", function () {
        task.continue();
        assert.equal(called, calledConst.continue);
    });

    it("should get a child by label", function () {
        assert.equal(parentTask.getChild(label), task);
    });

    it("should create a child task", function () {
        class TestTask extends Task<TaskType.TEST_TASK> {
            run(): void {}

            get type(): TaskType.TEST_TASK {
                return TaskType.TEST_TASK;
            }
        }

        const createdTask = task.create(TestTask, label);
        assert.isDefined(createdTask);
        assert.equal(created, createdTask);
        assert.include(createdTask, {
            parent: task,
            label: label
        });
    });
});
