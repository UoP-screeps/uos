import { Task } from "../../../src/task/entity/Task";
import { TaskType } from "../../../src/task/TaskConstants";
import { Container, Snapshot } from "typescript-ioc";
import { TaskService } from "../../../src/task/TaskService";
import { assert } from "chai";
import { resetGameAndMemory } from "../../mock";

describe("Task", function () {
    let snapshot: Snapshot;
    let called = "";
    const parent = "parent";
    const label = "label";
    let task: Task<TaskType.TEST_TASK>;

    before(function () {
        snapshot = Container.snapshot(); // save current container state

        // make sure memory is initialized
        resetGameAndMemory();

        // inject test service implementation
        Container.bind(TaskService).to(
            class TestTaskServiceImpl extends TaskService {
                continue(id: string): void {
                    if (id === task.id) {
                        called = "continue";
                    }
                }

                create(task: Task): void {
                    throw Error();
                }

                getById(id: string): Nullable<Task> {
                    throw Error();
                }

                getByLabel<T extends TaskType>(label: string, parent?: string): Nullable<Task<T>> {
                    throw Error();
                }

                isRunning(id: string): boolean {
                    called = "isRunning";
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
                        called = "start";
                    }
                }

                suspend(id: string): void {
                    if (id === task.id) {
                        called = "suspend";
                    }
                }

                terminate(id: string): void {
                    if (id === task.id) {
                        called = "terminate";
                    }
                }
            }
        );

        task = new (class extends Task<TaskType.TEST_TASK> {
            run(): void {}

            get type(): TaskType.TEST_TASK {
                return TaskType.TEST_TASK;
            }
        })({ label, parent });
    });

    beforeEach(function () {
        called = "";
    });

    after(function () {
        snapshot.restore(); // restore container
    });

    it("should have an id", function () {
        assert.exists(task.id);
    });

    it("should have correct parent", function () {
        assert.equal(task.parent, parent);
    });

    it("should have correct label", function () {
        assert.equal(task.label, label);
    });

    it("should start correctly by calling start service", function () {
        task.start();
        assert.equal(called, "start");
    });

    it("should terminate correctly by calling terminate service", function () {
        task.terminate();
        assert.equal(called, "terminate");
    });

    it("should get result from isRunning", function () {
        task.isRunning();
        assert.equal(called, "isRunning");
    });

    it("should suspend correctly by calling suspend service", function () {
        task.suspend();
        assert.equal(called, "suspend");
    });

    it("should continue correctly by calling continue service", function () {
        task.continue();
        assert.equal(called, "continue");
    });
});
