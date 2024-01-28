/**
 * @file Initializes the game.
 */

import { game, gameConfigOptions } from "emath.js/game";

const Game = new game({
    mode: "development",
    name: {
        title: "Generic Training Game",
        id: "generic-training-game",
    },
} as gameConfigOptions);

if (Game.config.mode === "development") (window as any)["Game"] = Game;

export default Game;