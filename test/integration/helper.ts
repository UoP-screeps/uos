/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */

const ScreepsServerMockup = require("screeps-server-mockup");
const ScreepsServer: MockedServerConstructor = ScreepsServerMockup.ScreepsServer;
const stdHooks: StdHooks = ScreepsServerMockup.stdHooks;

/*
 * Helper class for creating a ScreepsServer and resetting it between tests.
 * See https://github.com/Hiryus/screeps-server-mockup for instructions on
 * manipulating the terrain and game state.
 */
export class IntegrationTestHelper {
    private _server?: MockedServer;

    get server() {
        return this._server!;
    }

    private _player?: MockedUser;

    get player() {
        return this._player!;
    }

    set player(player) {
        this._player = player;
    }

    async beforeEach() {
        this._server = new ScreepsServer();

        await this.server.world.reset();

        // Start server
        await this.server.start();
    }

    async afterEach() {
        await this._server!.stop();
    }

    before() {
        stdHooks.hookWrite();
    }
}

export const helper = new IntegrationTestHelper();
