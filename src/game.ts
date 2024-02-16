/**
 * @file Initializes the game.
 */
import { E, ESource } from "emath.js";
import { game } from "emath.js/game";

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

/**
 * Config bool
 */
const gameConfig = {
    saveOnExit: true,
};

// console.log("configTest", E(69).format());

if (Game.config.mode === "development") (window as any)["Game"] = Game;

export default Game;
export { gameConfig };