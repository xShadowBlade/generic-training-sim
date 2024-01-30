/**
 * @file Initializes stats.
 */
import Game from "../game";

const power = Game.addCurrency("power");

Game.eventManager.setEvent("Gain Power", "interval", 0, (dt) => {
    // console.log("Power gained");
    power.static.gain(dt);
});


export { power };