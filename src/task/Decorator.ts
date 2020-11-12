import { TaskConstructor } from "./entity/Task";
import { Container } from "typescript-ioc";
import TaskFactory from "./TaskFactory";

/**
 * 加在Task的定义前，用于方便地注册任务构造器
 * @param target
 */
export const TaskDef = function (target: TaskConstructor): void {
    Container.get(TaskFactory).register(target);
};
