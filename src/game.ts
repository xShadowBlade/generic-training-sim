/**
 * @file Initializes the game.
 */
// import { E, ESource } from "emath.js";
import { Game as GameClass } from "emath.js/game";
import type { AreaType } from "./features/movement";

const Game = new GameClass({
    // // @ts-expect-error - Replaced by webpack
    mode: "development",
    name: {
        title: "Generic Training Game",
        id: "generic-training-game",
        version: "0.5.5",
    },
    settings: {
        framerate: 30,
    },
});

const player = {
    name: "Player", // TODO: Name
    training: {
        // type: "power" as AreaType,
        // area: 0,

        current: "power" as AreaType,
        powerArea: 0,
        mindArea: 0,
        bodyArea: 0,
    },
    augment: {
        current: 0,
    },
};
Game.dataManager.setData("player", player);

// TODO: Object.defineProperty
// Object.defineProperty(this, "player", {
//     get: () => Game.dataManager.getData("player"),
//     set: (val) => Game.dataManager.setData("player", val),
// });

/** debug */
const gameConfig = {
    saveOnExit: true,
};

// console.log("configTest", E(69).format());

if (Game.config.mode === "development") (window as typeof window & { Game: typeof Game })["Game"] = Game;

// Aliases
/** @alias Game.dataManager.setData */
const setData = Game.dataManager.setData.bind(Game.dataManager);

export default Game;
export { gameConfig, player };
export { setData };