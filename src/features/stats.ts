/**
 * @file Initializes stats.
 */
import { E } from "emath.js";
import Game, { player } from "../game";
import { gameCurrency, Pointer } from "emath.js/game";
import type { multiplierBasedArea } from "utility/area";

/**
 * Class to represent a stat.
 * TODO
 */
class stat<Multipliers> {
    public name: string;
    public currency: gameCurrency;
    public area: multiplierBasedArea<Multipliers>;
    constructor (name: string | Pointer<gameCurrency>, area: multiplierBasedArea<Multipliers>) {
        this.currency = typeof name === "string" ? Game.addCurrency(name) : (typeof name === "function" ? name() : name);
        this.name = this.currency.name;
        this.area = area;
    }
}

// Power is the main currency, used to change augmentations and train
const power = Game.addCurrency("power");

// Mind is power but ^0.75, but alot more effective in combat (^2, so it is ^1.5)
const mind = Game.addCurrency("mind");
mind.static.boost.setBoost({
    id: "mind",
    name: "Mind",
    desc: "Boost from mind",
    value: (n) => n.pow(0.75),
    order: 99,
});

// Body is power but ^0.9, and is used for health and defense
const body = Game.addCurrency("body");
body.static.boost.setBoost({
    id: "body",
    name: "Body",
    desc: "Boost from body",
    value: (n) => n.pow(0.9),
    order: 99,
});

Game.eventManager.setEvent("Gain Stats", "interval", 0, (dt) => {
    // console.log("Power gained");
    switch (player.training.type) {
    case "power": default:
        power.static.gain(dt);
        break;
    case "mind":
        mind.static.gain(dt);
        break;
    case "body":
        body.static.gain(dt);
        break;
    }
    // power.static.gain(dt);
});

// Circular dependency
// eslint-disable-next-line import/first
// import { training } from "./training";
// const powerStat = new stat(power, training.power);
// const mindStat = new stat(mind, training.mind);
// const bodyStat = new stat(body, training.body);

// const stats = {
//     power: powerStat,
//     mind: mindStat,
//     body: bodyStat,
// };
// export { stats };

interface StatsStored {
    power: E;
    mind: E;
    body: E;
    credits: E;
}

export { power, mind, body, StatsStored };