/**
 * @file This file contains all the functions related to movement.
 */
import { E } from "emath.js";
import { formatTrainingArea, getTrainingArea } from "./training";
import { power } from "./stats";
import Game from "../game";

let playerState: ["idle", ...any] = ["idle", 0];

/**
 * Function to move to a new area.
 * @param areaN - The area to to move to.
 * @param force - Whether to force the move, regardless of power.
 */
function move (areaN: number, force = false) {
    // console.log(power.value.gt(getTrainingArea(areaN).req));
    if (!force && power.value.lt(getTrainingArea(areaN).req)) {
        console.log(`You are not strong enough to train in this area. (You need ${getTrainingArea(areaN).req.format()} power)`);
        return;
    }
    playerState = ["idle", areaN];
    Game.dataManager.setData("currentArea", areaN);
    // console.log(getTrainingArea(areaN).mul);
    power.static.boost.setBoost(
        "trainingArea",
        "Training Area",
        "Boost from training area",
        (n) => {
            // console.log("boost in", n);
            // console.log(",mul", getTrainingArea(areaN).mul);
            // console.log("return", E(1).mul(getTrainingArea(areaN).mul));
            return n.mul(getTrainingArea(areaN).mul);
            // return E(1); // debug
        },
        2,
    );
    console.log(formatTrainingArea(areaN));
}
// addStartFunction(() => Game.functions.move(Game.data.player.state[1]));
move(0, true);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (Game.config.mode === "development") (window as any)["move"] = move;

export { move, playerState };