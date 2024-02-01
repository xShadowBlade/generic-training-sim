/**
 * @file Initializes the game.
 */
import { E } from "emath.js";
import { game, gameConfigOptions } from "emath.js/game";

const Game = new game({
    mode: "development",
    name: {
        title: "Generic Training Game",
        id: "generic-training-game",
    },
    settings: {
        framerate: 30,
    },
} as gameConfigOptions);

console.log("configTest", E(69).format());

if (Game.config.mode === "development") (window as any)["Game"] = Game;

export default Game;