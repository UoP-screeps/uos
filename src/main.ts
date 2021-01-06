import { ErrorMapper } from "utils/ErrorMapper";

export const loop = ErrorMapper.wrapLoop(() => {
    // do nothing
    Game.notify(Game.time.toString());
});
