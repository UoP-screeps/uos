# 任务系统

Task

## 需求：

使用任务系统，使得任务在不知道对方的情况下可以完成自己的任务，或者让子任务帮助自己完成。

## 设计：


使用：

```ts
import { Task } from "./Task";
import { TaskDef } from "./Decorator";
import { TaskType } from "./TaskConstants";
import { Container } from "typescript-ioc";
import { TaskFactory } from "./TaskFactory";

// 定义一个任务
@TaskDef
class TaskA extends Task<TaskType.TASK_A> {
    get type(): TaskType.TASK_A {
        return TaskType.TASK_A;
    }

    // 定义自己的行为
    run(): void {
        // 启动一个子任务
        create(TaskA, "label");
        
        // 结束一个子任务
        getChild("label").terminate();
        
        // 结束自己
        terminate();
    }
}
```

