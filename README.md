# screeps-os
车架子

TODO: 测试uos， 实现 `terminate`

## 写一个程序
写一个program，比如
```typescript
import {ProgramIndex} from "../uos/ProgramIndex"
export class HelloWorld implements Program{
    run(this: Process){
        Logger.log("Hello world");
    }
}
ProgramIndex.registerProgram("hello", HelloWorld);
```
`ProgramIndex.registerProgram` 函数用于把程序保存到一个固定的名字。 

然后同时在 `program/import.ts` 文件里添加这个文件。
每个tick都会执行 `run` 函数里面的内容。

## 结束一个进程
使用 `this.terminate()` 来结束一个进程
```typescript
import {ProgramIndex} from "../uos/ProgramIndex"
export class Terminate implements Program{
    run(this: Process){
        this.terminate();
    }
}
ProgramIndex.registerProgram("terminate", Terminate);
```
## 储存信息
可以通过 `this.data` 获得每个进程单独的永久记忆。
```typescript
import {ProgramIndex} from "../uos/ProgramIndex"
export class SaveMemory implements Program{
    run(this: Process){
        this.data.x = 1;
        this.data.y = {
            f: 1
        }
    }
}
ProgramIndex.registerProgram("saveMemory", SaveMemory);
```

## 设置优先级
`this.priority`
（没有实装，暂时改了没有效果）

## 启动新的进程
可以通过 `this.launchProcess` 函数来启动新的进程

## 检查是否进程已经启动
通过 `this.isProcessRunning` 来检查子进程是否还在运行。

## 获取一个子进程
`this.getProcessByLabel` 可以获取指定label的子进程

