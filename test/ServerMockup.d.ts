interface MockServerOptions {
    path: string;
    logdir: string;
    port: number;
    modfile?: string;
}

declare interface StdHooks {
    hookWrite(): void;
    hookWrite(): void;
    resetWrite(): void;
    resetWrite(): void;
}

declare interface MockedServerConstructor {
    new(opts?: Partial<MockServerOptions>): MockedServer;
}

declare class MockedServer {
    driver: any;
    config: any;
    common: any;
    constants: any;
    connected: boolean;
    world: MockedWorld;
    constructor(opts?: Partial<MockServerOptions>);
    setOpts(opts: MockServerOptions): this;
    getOpts(): MockServerOptions;
    connect(): Promise<this>;
    tick(): Promise<this>;
    start(): Promise<this>;
    stop(): this;
}

declare class MockedWorld {
    /**
     Constructor
     */
    constructor(server: MockedServer);
    /**
     Getters
     */
    get gameTime(): Promise<number>;
    /**
     Connect to server (if needed) and return constants, database, env and pubsub objects
     */
    load(): Promise<{
        C: any;
        db: any;
        env: any;
        pubsub: any;
    }>;
    /**
     Set room status (and create it if needed)
     This function does NOT generate terrain data
     */
    setRoom(room: string, status?: string, active?: boolean): Promise<void>;
    /**
     Simplified alias for setRoom()
     */
    addRoom(room: string): Promise<void>;
    /**
     Return room terrain data (walls, plains and swamps)
     Return a TerrainMatrix instance
     */
    getTerrain(room: string): Promise<MockedTerrainMatrix>;
    /**
     Define room terrain data (walls, plains and swamps)
     @terrain must be an instance of TerrainMatrix.
     */
    setTerrain(room: string, terrain?: MockedTerrainMatrix): Promise<void>;
    /**
     Add a RoomObject to the specified room
     Returns db operation result
     */
    addRoomObject(room: string, type: string, x: number, y: number, attributes?: {}): Promise<any>;
    /**
     Reset world data to a barren world with no rooms, but with invaders and source keepers users
     */
    reset(): Promise<void>;
    /**
     Stub a basic world by adding 9 plausible rooms with sources, minerals and controllers
     */
    stubWorld(): Promise<void>;
    /**
     Get the roomObjects list for requested roomName
     */
    roomObjects(roomName: string): Promise<any[]>;
    /**
     Add a new user to the world
     */
    addBot({ username, room, x, y, gcl, cpu, cpuAvailable, active, spawnName, modules }: AddBotOptions): Promise<MockedUser>;
    private updateEnvTerrain;
}

interface AddBotOptions {
    username: string;
    room: string;
    x: number;
    y: number;
    gcl?: number;
    cpu?: number;
    cpuAvailable?: number;
    active?: number;
    spawnName?: string;
    modules?: {};
}

type MockedTerrainType = 'plain' | 'wall' | 'swamp';

declare class MockedTerrainMatrix {
    private data;
    /**
     Constructor
     */
    constructor();
    /**
     Getters
     */
    get(x: number, y: number): MockedTerrainType;
    /**
     Setters
     */
    set(x: number, y: number, value: MockedTerrainType): this;
    /**
     Serialize the terrain for database storage
     */
    serialize(): string;
    /**
     Return a string representation of the matrix
     */
    static unserialize(str: string): MockedTerrainMatrix;
}

declare type MockedUserNotification = {
    message: string;
    type: string;
    date: number;
    count: number;
    _id: string;
};

declare class MockedUser {
    /**
     Constructor
     */
    constructor(server: MockedServer, data: {
        _id: string;
        username: string;
    });
    /**
     Getters
     */
    get id(): string;
    get username(): string;
    get cpu(): Promise<number>;
    get cpuAvailable(): Promise<number>;
    get gcl(): Promise<number>;
    get rooms(): Promise<any>;
    get lastUsedCpu(): Promise<number>;
    get memory(): Promise<string>;
    get notifications(): Promise<MockedUserNotification[]>;
    get newNotifications(): Promise<MockedUserNotification[]>;
    get activeSegments(): Promise<number[]>;
    /**
     Return the content of user segments based on @list (the list of segments, ie: [0, 1, 2]).
     */
    getSegments(list: number[]): Promise<any[]>;
    /**
     Set a new console command to run next tick
     */
    console(cmd: string): Promise<any>;
    /**
     Return the current value of the requested user data
     */
    getData(name: string): Promise<any>;
    /**
     Initialise console events
     */
    init(): Promise<this>;
}