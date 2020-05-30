# uos
车架子。目标：容易扩展，容易修改各层逻辑的结构。

TODO: 运输，全局管理，房间管理

## 写一个程序
写一个program，比如
```typescript
import {ProgramIndex} from "../uos/ProgramIndex"
export class HelloWorld implements Program{
    run(process: Process){
        Logger.log("Hello world");
    }
}
ProgramIndex.registerProgram("hello", HelloWorld);
```
`ProgramIndex.registerProgram` 函数用于把程序保存到一个固定的名字。 

然后同时在 `program/import.ts` 文件里添加这个文件。
每个tick都会执行 `run` 函数里面的内容。

## 结束一个进程
使用 `process.terminate()` 来结束一个进程
```typescript
import {ProgramIndex} from "../uos/ProgramIndex"
export class Terminate implements Program{
    run(process: Process){
        process.terminate();
    }
}
ProgramIndex.registerProgram("terminate", Terminate);
```
注意，所有子进程也会被结束。

## 储存信息
可以通过 `process.data` 获得每个进程单独的永久记忆。
```typescript
import {ProgramIndex} from "../uos/ProgramIndex"
export class SaveMemory implements Program{
    run(process: Process){
        process.data.x = 1;
        process.data.y = {
            f: 1
        }
    }
}
ProgramIndex.registerProgram("saveMemory", SaveMemory);
```
也可以用generic来表示data的类型
```typescript
import {ProgramIndex} from "../uos/ProgramIndex"
export class SaveMemory implements Program{
    run(process: Process<{a: number}>){
        process.data.a = 1;
    }
}
ProgramIndex.registerProgram("saveMemory", SaveMemory);
```

## 设置优先级
`process.priority`

优先级高的进程会靠前执行。

## 启动新的进程
可以通过 `process.launchProcess` 函数来启动新的进程。在这个tick就会立刻执行。

## 检查是否进程已经启动
通过 `process.isProcessRunning` 来检查子进程是否还在运行。

## 获取一个子进程
`process.getProcessByLabel` 可以获取指定label的子进程

