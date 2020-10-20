import { UosKernel } from "../Kernel";
import { resetGameAndMemory } from "../../../test/mock";
import { assert } from "chai";
import {
    clearProgramIndex,
    makeCountingProgram,
    makeDeletingProgram,
    makeDummyProgram,
    makeHighPriorityProgram,
    makeLaunchingProgram,
    makeLowPriorityProgram,
    makeMidPriorityProgram,
    resetTestProgramRunCount
} from "./TestUtils";
import { ProcessError } from "../ProcessError";

resetGameAndMemory();

describe("Kernel", function() {
    beforeEach(function() {
        resetGameAndMemory();
        clearProgramIndex();
    });

    it("should successfully get a process by id", function() {
        const kernel: Kernel = new UosKernel();
        makeDummyProgram("testProgram");
        kernel.launchProcess("test", "testProgram", {});
        const process = kernel.getProcessByLabel("test");
        assert.deepStrictEqual(kernel.getProcessByPid(process.pid), process);
    });

    it("should run kernel processes", function() {
        makeCountingProgram("dummy");
        const kernel = new UosKernel();
        kernel.launchProcess("test", "dummy", {});
        kernel.run();
        const process = kernel.getProcessByLabel("test");
        assert.strictEqual(process.data.a, 1);
    });

    it("should be able to recover a process next tick", function() {
        makeDummyProgram("dummy");
        const kernel0 = new UosKernel();
        kernel0.launchProcess("test", "dummy", {});
        const process0 = kernel0.getProcessByLabel("test");
        const kernel1 = new UosKernel();
        const process1 = kernel1.getProcessByLabel("test");
        assert.deepStrictEqual(process1, process0);
    });

    it("should run non-kernel processes ", function() {
        makeCountingProgram("counting");
        const kernel = new UosKernel();
        kernel.launchProcess("test", "counting", {});
        const process0 = kernel.getProcessByLabel("test");
        process0.launchProcess("test", "counting", {});
        const process1 = process0.getProcessByLabel("test");
        kernel.run();
        assert.strictEqual(process1.data.a, 1);
    });

    it("should run added process", function() {
        makeCountingProgram("launched");
        makeLaunchingProgram("launching");
        const kernel = new UosKernel();
        kernel.launchProcess("test", "launching", {});
        const process0 = kernel.getProcessByLabel("test");
        kernel.run();
        const process1 = process0.getProcessByLabel("test");
        assert.strictEqual(process1.data.a, 1);
    });

    it("should not run deleted process", function() {
        makeCountingProgram("deleted");
        makeDeletingProgram("deleting");
        const kernel = new UosKernel();
        kernel.launchProcess("test", "deleting", {});
        const process0 = kernel.getProcessByLabel("test");
        process0.launchProcess("test", "deleted", {});
        const process1 = process0.getProcessByLabel("test");
        kernel.run();
        assert.strictEqual(process1.data.a, undefined);
    });

    it("should not get deleted processes id", function() {
        makeCountingProgram("deleted");
        makeDeletingProgram("deleting");
        const kernel = new UosKernel();
        kernel.launchProcess("test", "deleting", {});
        const process0 = kernel.getProcessByLabel("test");
        process0.launchProcess("test", "deleted", {});
        kernel.run();
        assert.throw(function() {
            kernel.getProcessByPid(process0.pid);
        }, ProcessError);
    });

    it("should not get deleted processes label", function() {
        makeCountingProgram("deleted");
        makeDeletingProgram("deleting");
        const kernel = new UosKernel();
        kernel.launchProcess("test", "deleting", {});
        const process0 = kernel.getProcessByLabel("test");
        process0.launchProcess("test", "deleted", {});
        kernel.run();
        assert.throw(function() {
            kernel.getProcessByLabel("test");
        }, ProcessError);
    });

    it("should run tasks with higher priority first", function() {
        makeLowPriorityProgram("low");
        makeMidPriorityProgram("mid");
        makeHighPriorityProgram("high");
        let kernel = new UosKernel();
        kernel.launchProcess("low", "low", {});
        const low = kernel.getProcessByLabel("low");
        kernel.launchProcess("mid", "mid", {});
        const mid = kernel.getProcessByLabel("mid");
        kernel.launchProcess("high", "high", {});
        const high = kernel.getProcessByLabel("high");
        kernel.run(); // let kernel run once to set priority;
        resetTestProgramRunCount();
        kernel = new UosKernel();
        kernel.run();
        assert.deepStrictEqual([low.data.a, mid.data.a, high.data.a], [2, 1, 0]);
    });
});
