export abstract class SpawnService{
    /**
     * 根据目的地，体型，时间提交请求
     * @param pos 出生之后的目的地
     * @param body 体型
     * @param time 时间
     * @return 生成的请求。
     */
    abstract request(pos: Pos, body: BodyPartConstant[], time: number): Optional<SpawnRequest>;

    /**
     * 根据id获取一个请求
     * @param id 请求的id
     */
    abstract get(id: string): SpawnRequest;

    /**
     * 根据id取消一个请求
     * @param id 请求的id
     */
    abstract cancel(id: string): void;

    /**
     * 根据id更新一个spawnRequest
     * @param spawnRequest 需要更新的request
     */
    abstract update(spawnRequest: SpawnRequest): void;
}

export interface SpawnRequest {
    readonly id: string;
    pos: Pos;
    body: BodyPartConstant[];
    time: number;
    readonly status: SpawnStatus;

    cancel(): void;
}

export enum SpawnStatus {
    Queued,
    SPAWNING,
    MOVING,
    DONE
}