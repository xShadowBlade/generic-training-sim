/**
 * @file Initializes stats.
 */
import { E, ESource } from "emath.js";
import Game, { player } from "../game";
import { GameCurrency, Pointer } from "emath.js/game";
import type { multiplierBasedArea } from "utility/area";
import { GameFormatClass } from "../display/global/format";

/**
 * Class to represent a stat.
 * TODO
 */
class stat<Multipliers> {
    public name: string;
    public currency: GameCurrency<string>;
    public area: multiplierBasedArea<Multipliers>;
    constructor (name: string | Pointer<GameCurrency<string>>, area: multiplierBasedArea<Multipliers>) {
        this.currency = typeof name === "string" ? Game.addCurrency(name) : (typeof name === "function" ? name() : name);
        this.name = this.currency.name;
        this.area = area;
    }
}

// Power is the main currency, used to change augmentations and train
const power = Game.addCurrency("power");

// Body is power but ^0.9, and is used for health and defense
const body = Game.addCurrency("body");
body.static.boost.setBoost({
    id: "body",
    name: "Body",
    description: "Property of body (^0.9)",
    value: (n) => n.pow(0.9),
    order: 99,
});

// Mind is power but ^0.75, but alot more effective in combat (^2, so it is ^1.5)
const mind = Game.addCurrency("mind");
mind.static.boost.setBoost({
    id: "mind",
    name: "Mind",
    description: "Property of mind (^0.75)",
    value: (n) => n.pow(0.75),
    order: 99,
});

// Mind boosts body which boosts power
const secondaryStatBoost = (n: E, x: E) => x.mul(n.add(1).div(1000).pow(0.1).add(0.5));
power.static.boost.setBoost({
    id: "boostFromBody",
    name: "Boost from body",
    description: (gameFormat: GameFormatClass) => `Secondary stat boost from body: ${gameFormat.multi(secondaryStatBoost(body.value, E(1)))}`,
    value: (n) => secondaryStatBoost(body.value, n),
    order: 3,
});

body.static.boost.setBoost({
    id: "boostFromMind",
    name: "Boost from mind",
    description: (gameFormat: GameFormatClass) => `Secondary stat boost from mind: ${gameFormat.multi(secondaryStatBoost(mind.value, E(1)))}`,
    value: (n) => secondaryStatBoost(mind.value, n),
    order: 3,
});

const gainStats = (dt: ESource) => {
    switch (player.training.current) {
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
};

Game.eventManager.setEvent("Gain Stats", "interval", 0, gainStats);

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

const scoreFormula = (x: E, factor: E) => x.div(10).add(1).pow(factor.pow(-1.5)).log(1.1).div(factor).pow(2);
// const scoreFormula = (x: E, factor: E) => x.div(10).add(1).pow(factor.pow(1.5).recip()).pow(0.2).mul(factor.recip());

const score = {
    get power () { return scoreFormula(power.value, E(1)); },
    get body () { return scoreFormula(body.value, E(0.9)); },
    get mind () { return scoreFormula(mind.value, E(0.75)); },
    get total () { return this.power.mul(this.mind).mul(this.body).pow(0.4); },
};

interface StatsStored {
    power: E;
    mind: E;
    body: E;
    credits: E;
}

export { power, mind, body, StatsStored, gainStats, score };