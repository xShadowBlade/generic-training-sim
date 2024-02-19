/**
 * @file Initializes the game.
 */
import { E, ESource } from "emath.js";
import { game } from "emath.js/game";
import type { AreaType } from "./features/movement";

const Game = new game({
    // // @ts-expect-error - Replaced by webpack
    mode: "development",
    name: {
        title: "Generic Training Game",
        id: "generic-training-game",
    },
    settings: {
        framerate: 30,
    },
});

const player = {
    name: "Player", // TODO: Name
    training: {
        type: "power" as AreaType,
        area: 0,
    },
    augment: {
        current: 0,
    },
};
Game.dataManager.setData("player", player);

/** debug */
const gameConfig = {
    saveOnExit: true,
};

// console.log("configTest", E(69).format());

if (Game.config.mode === "development") (window as any)["Game"] = Game;

export default Game;
export { gameConfig, player };