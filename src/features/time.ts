/**
 * @file Time
 */
import { E, ESource } from "emath.js";
import Game, { player } from "../game";

import { power, body, mind } from "./stats";
import { credits } from "./credits";
// import { playerState } from "./movement";

let timePlayed = Game.dataManager.setData("timePlayed", E(0));
let timePlayedReal = Game.dataManager.setData("timePlayedReal", E(0));
let timeLastPlayed = Game.dataManager.setData("timeLastPlayed", E(0));
/**
 * Function to update the time played.
 * @param dt - dt
 * @param real - Whether to update the real time played.
 */
function updateTimePlayed (dt: ESource, real = true) {
    // const time = Game.dataManager.getData("timePlayed") ?? E(0);
    // const timeReal = Game.dataManager.getData("timePlayedReal") ?? E(0);
    // const last = Game.dataManager.getData("timeLastPlayed");
    // const now = E(Date.now());
    // const dt = now.sub(last);

    // Game.dataManager.setData("timePlayed", timePlayed?.add(dt));
    // if (real) Game.dataManager.setData("timePlayedReal", timePlayedReal?.add(dt));

    timePlayed.value = timePlayed.value.add(dt);
    if (real) timePlayedReal.value = timePlayedReal.value.add(dt);

    // setTimePlayed(timePlayed.add(dt));
    // if (real) setTimePlayedReal(timePlayedReal.add(dt));

    // Game.dataManager.setData("timeLastPlayed", now);
}

Game.eventManager.setEvent("timePlayed", "interval", 0, updateTimePlayed);

/**
 * Function to update the time last played.
 */
function updateTimeLastPlayed () {
    // Game.dataManager.setData("timeLastPlayed", E(Date.now()));
    timeLastPlayed.value = E(Date.now());
    // setTimeLastPlayed(E(Date.now()));
}

interface IOfflineProgress {
    dt: E;
    power: E;
    credits: E;
    body: E;
    mind: E;
}

/**
 * Function to update the time played offline.
 * @returns The dt, power, credits gained. More to be added later.
 */
function offlineProgress (): IOfflineProgress {
    const now = E(Date.now());
    // const last = Game.dataManager.getData("timeLastPlayed");
    // const dt = now.sub(last);
    const dt = now.sub(timeLastPlayed.value);
    // console.log("dt", dt);
    // If the last time played is less than 5 seconds ago, don't give any progress.
    if (!timeLastPlayed || dt.lt(5e3) || timeLastPlayed.value.eq(0)) {
        updateTimeLastPlayed();
        return {
            dt: E(0),
            power: E(0),
            credits: E(0),
            body: E(0),
            mind: E(0),
        };
    }
    updateTimePlayed(dt.toNumber(), false);
    updateTimeLastPlayed();

    // const currentAreaType = playerState[1];
    const currentAreaType = player.training.current;

    // const powerGain = power.static.gain(dt);
    const creditsGain = credits.static.gain(dt);

    return {
        dt,
        // power: powerGain,
        credits: creditsGain,
        power: currentAreaType === "power" ? power.static.gain(dt) : E(0),
        // credits: currentAreaType === "credits" ? credits.static.gain(dt) : E(0),
        body: currentAreaType === "body" ? body.static.gain(dt) : E(0),
        mind: currentAreaType === "mind" ? mind.static.gain(dt) : E(0),
    };
}

// Game.dataManager.addEventOnLoad(offlineProgress);

/**
 * Function to update the time last played.
 */
// function updateTimeLastPlayed () {
//     Game.dataManager.setData("timeLastPlayed", E(Date.now()));
// }

export { updateTimePlayed, updateTimeLastPlayed, offlineProgress, IOfflineProgress, timePlayed, timePlayedReal, timeLastPlayed };