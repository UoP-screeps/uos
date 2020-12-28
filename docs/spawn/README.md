## Spawn

#### 需求

设计一个通用的管理出生的模块

#### 设计

接口指定需要的体型，时间，地点。

用例：

```ts
// 创建请求
const spawnRequest = spawnService.request(
    body,
    time,
    pos
);

// 修改请求
spawnRequest.setBody(newBody);
spawnService.update(spawnRequest);

// 查询请求
spawnRequest = spawnService.get(id);

// 取消请求
spawnRequest.cancel();

```
