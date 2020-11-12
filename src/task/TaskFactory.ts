import { Task, TaskConstructor } from "./entity/Task";
import { TaskType } from "./TaskConstants";
import { Singleton } from "typescript-ioc";
import ObjectUtils from "../utils/ObjectUtils";

@Singleton
export default class TaskFactory {
    private readonly types: { [key in TaskType]?: Constructor<Task> };

    constructor() {
        this.types = {};
    }

    /**
     * 注册一个类型，可以用工厂自动构建这个类型的任务。
     * @param type 任务的类型
     */
    register<T extends TaskType>(type: TaskConstructor<T>): void {
        this.types[type.prototype.type] = type;
    }

    /**
     * 创建一个类型的任务
     * @param type 任务的类型
     * @param opts 一个对象，可以有 parent 和 label两个可选的参数。
     * @return 返回创建成功之后的任务
     */
    createTask<T extends TaskType>(
        type: T,
        opts?: {
            parent?: string;
            label?: string;
        }
    ): Task<T> {
        const taskConstructor = this.types[type];
        if (taskConstructor == undefined) {
            throw new Error(`Unknown type ${type}`);
        }
        return new (taskConstructor as TaskConstructor<T>)(opts);
    }

    /**
     * Used in tests to clear the task factory
     * 在测试环境中用于重置工厂（用接口让他不出现在公共api中？）
     */
    clear(): void {
        ObjectUtils.removeAll(this.types);
    }
}
