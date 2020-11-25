# 消息队列

mq

## 需求：

利用消息队列，实现跨tick不同模块间交流。

## 设计：

1. 全局消息队列对象：用于发送消息到一个频道。可以发给单个接受对象，也可以广播给所有的接受对象。
2. 消息接收方法。在构造对象的时候可以定义一个方法是接受到一个消息的回调。这个方法可以选择消费消息，也可以选择让消息继续发给下一个接受对象。
3. 消息会立刻触发回调。

使用：
```ts
class A {
    @Consume("channel1") // 必须使用静态方法
    static handle(message: string): boolean {
        console.log(message);
        return true;
    }
}

class B {
    mqService: MQService = Container.get(MQService);
    someFunction() {
        this.mqService.send("channel1", "Hello World!");
    }
}
```

