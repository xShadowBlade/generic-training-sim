/**
 * @file Initializes the game.
 */
import { E, ESource } from "emath.js";
import { game } from "emath.js/game";

const Game = new game({
    mode: "development",
    name: {
        title: "Generic Training Game",
        id: "generic-training-game",
    },
    settings: {
        framerate: 30,
    },
});

// console.log("configTest", E(69).format());

if (Game.config.mode === "development") (window as any)["Game"] = Game;

export default Game;