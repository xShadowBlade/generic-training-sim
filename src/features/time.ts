/**
 * @file Time
 */
import { E, ESource } from "emath.js";
import Game from "../game";

import { power } from "./stats";
import { credits } from "./credits";

Game.dataManager.setData("timePlayed", E(0));
Game.dataManager.setData("timePlayedReal", E(0));
Game.dataManager.setData("timeLastPlayed", E(0));

/**
 * Function to update the time played.
 * @param dt - dt
 * @param real - Whether to update the real time played.
 */
function updateTimePlayed (dt: ESource, real = true) {
    const time = Game.dataManager.getData("timePlayed") ?? E(0);
    const timeReal = Game.dataManager.getData("timePlayedReal") ?? E(0);
    // const last = Game.dataManager.getData("timeLastPlayed");
    // const now = E(Date.now());
    // const dt = now.sub(last);
    Game.dataManager.setData("timePlayed", time.add(dt));
    if (real) Game.dataManager.setData("timePlayedReal", timeReal.add(dt));
    // Game.dataManager.setData("timeLastPlayed", now);
}

Game.eventManager.setEvent("timePlayed", "interval", 0, updateTimePlayed);

/**
 * Function to update the time last played.
 */
function updateTimeLastPlayed () {
    Game.dataManager.setData("timeLastPlayed", E(Date.now()));
}

interface IOfflineProgress {
    dt: E;
    power: E;
    credits: E;
}

/**
 * Function to update the time played offline.
 * @returns The dt, power, credits gained. More to be added later.
 */
function offlineProgress (): IOfflineProgress {
    const now = E(Date.now());
    const last = Game.dataManager.getData("timeLastPlayed");
    const dt = now.sub(last);
    console.log("dt", dt);
    // If the last time played is less than 5 seconds ago, don't give any progress.
    if (!last || dt.lt(5e3) || last.eq(0)) {
        updateTimeLastPlayed();
        return {
            dt: E(0),
            power: E(0),
            credits: E(0),
        };
    }
    updateTimePlayed(dt.toNumber(), false);
    updateTimeLastPlayed();

    const powerGain = power.static.gain(dt);
    const creditsGain = credits.static.gain(dt);

    return {
        dt,
        power: powerGain,
        credits: creditsGain,
    };
}

// Game.dataManager.addEventOnLoad(offlineProgress);

/**
 * Function to update the time last played.
 */
// function updateTimeLastPlayed () {
//     Game.dataManager.setData("timeLastPlayed", E(Date.now()));
// }

export { updateTimePlayed, updateTimeLastPlayed, offlineProgress, IOfflineProgress };