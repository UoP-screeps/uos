# 储存

Memory

## 需求：

用一套接口，像数据库一样高效读写数据

## 设计：

每个集合储存特定类型。  
每个类型有自己的储存
方便地获取/管理每个储存的数据库
可以进行index来进行方便的查询
例如：
```ts
@Data
class SomeData {
    @Index
    index: number;

    value: string;
}

@CollectionFor(SomeData)
class DataCollection extends Collection<SomeData> {
    
}

dataCollection = Container.get(DataCollection);list((v) => v.index === 0);
dataCollection.list({index: 1});
dataCollection.list((v) => v.index === 1);
```

