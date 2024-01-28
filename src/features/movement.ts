/**
 * @fileoverview This file contains all the functions related to movement.
 */
import { E } from "emath.js";
import { training, formatTrainingArea } from "./upgrades";
import { power } from "./stats";

/**
 * Function to round a number to the nearest power of 10.
 * @param areaN - The area to to move to.
 * @param force - Whether to force the move, regardless of power.
 */
function move (areaN: number, force = false) {
    if (!force && Game.data.stats.power.value.lt(formatTrainingArea(areaN, 1).req)) { console.log(`You are not strong enough to withstand this area. (You need ${formatTrainingArea(areaN, 1).req.format()} power)`); return; }
    // Game.data.player.state = ["idle", areaN];
    // Game.static.stats.power.boost.bSet(
    //     "trainingArea",
    //     "Training Area",
    //     "Boost from training area",
    //     (n) => E(n).mul(formatTrainingArea(areaN, 1).mul),
    //     2,
    // );
    power.static.boost.setBoost(
        "trainingArea",
        "Training Area",
        "Boost from training area",
        (n) => E(n).mul(formatTrainingArea(areaN, 1).mul),
        2,
    );
    console.log(formatTrainingArea(areaN));
}
// addStartFunction(() => Game.functions.move(Game.data.player.state[1]));

export { move };