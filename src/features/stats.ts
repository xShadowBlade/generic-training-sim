/**
 * @file Initializes stats.
 */
import Game from "../game";

const power = Game.addCurrency("power");

// Test
// power.static.boost.setBoost({
//     id: "test",
//     name: "Test",
//     desc: "Test boost",
//     value: (n) => n.pow(0.75),
//     order: 99,
// });

// Mind is power but ^0.75
// const mind = Game.addCurrency("mind");
// mind.static.boost.setBoost({
//     id: "mind",
//     name: "Mind",
//     desc: "Boost from mind",
//     value: (n) => n.pow(0.75),
//     order: 99,
// });

Game.eventManager.setEvent("Gain Power", "interval", 0, (dt) => {
    // console.log("Power gained");
    power.static.gain(dt);
});


export { power };