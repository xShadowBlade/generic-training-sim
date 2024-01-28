/**
 * @file Initializes stats.
 */
import Game from "../game";

const power = Game.addCurrency("power");

Game.eventManager.addEvent("Gain Power", "interval", 1000, (dt) => {
    power.static.gain(dt);
    // TODO: Add display for power
});

// addLoopFunction((dt) => {
//     Game.static.stats.power.gain(dt);
//     document.getElementById('power').innerHTML = `✊ | Power: ${Game.data.stats.power.value.format()}`;
// });

export { power };