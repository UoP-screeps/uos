import { TaskConstructor } from "./entity/Task";
import { Container } from "typescript-ioc";
import TaskFactory from "./TaskFactory";

export const TaskDef = function (target: TaskConstructor): void {
    Container.get(TaskFactory).register(target);
};
