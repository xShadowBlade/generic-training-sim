/**
 * @file Initializes stats.
 */
import Game from "../game";

const power = Game.addCurrency("power");

Game.eventManager.addEvent("Gain Power", "interval", 100, (dt) => {
    // console.log("Power gained");
    power.static.gain(dt);
    // console.log(power.data.value.format());
    // TODO: Add display for power
    const powerElement = document.getElementById("power") as HTMLElement;
    powerElement.innerHTML = `✊ | Power: ${power.value.format()}`;
});


export { power };