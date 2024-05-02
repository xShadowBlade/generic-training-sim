/**
 * @file Features/Credits - Credits and upgrades
 */
import { E, ESource, roundingBase } from "emath.js";
import Game from "../game";
import { power, body, mind } from "./stats";
import { GameFormatClass } from "../display/global/format";

const credits = Game.addCurrency("credits");

const upgCostFormula = (n: E) => roundingBase(E.pow(1.2, n.pow(1.2)).mul(10), 10, 1);

const secondaryStatBoost = (n: E, x: E, level: E) => x.mul(n.add(1).div(1000).pow(secondaryStatBoostFactor(level)).add(0.5));
const secondaryStatBoostFactor = (level: E) => level.pow(0.075).sub(0.9);

credits.static.addUpgrade([
    {
        name: "Basic Power Boost",
        id: "upg1Credits",
        cost: upgCostFormula, // TODO: come up with a better formula
        maxLevel: E(1000),
        // el: () => getUpgDefaults().keepCreditsOnUpgrade.keep,
        el: () => Boolean(Game.dataManager.getData("keepCreditsOnUpgrade") ?? false),
        effect: function (level) {
            power.static.boost.setBoost({
                id: "boostUpg1Credits",
                name: "Basic Stats Boost",
                // description: "Basic Stats Boost",
                description: (gameFormat: GameFormatClass) => `Basic Stats Boost: ${gameFormat.multi(E.pow(2, level.sub(1)))}`,
                value: (n) => n.mul(E.pow(2, level.sub(1))),
                order: 2,
            });
        },
    },
    {
        name: "Basic Body Boost",
        id: "upg2Credits",
        cost: upgCostFormula, // TODO: come up with a better formula
        maxLevel: E(1000),
        // el: () => getUpgDefaults().keepCreditsOnUpgrade.keep,
        el: () => Boolean(Game.dataManager.getData("keepCreditsOnUpgrade") ?? false),
        effect: function (level) {
            body.static.boost.setBoost({
                id: "boostUpg2Credits",
                name: "Basic Stats Boost",
                // description: "Basic Stats Boost",
                description: (gameFormat: GameFormatClass) => `Basic Stats Boost: ${gameFormat.multi(E.pow(2, level.sub(1)))}`,
                value: (n) => n.mul(E.pow(2, level.sub(1))),
                order: 2,
            });
        },
    },
    {
        name: "Basic Mind Boost",
        id: "upg3Credits",
        cost: upgCostFormula, // TODO: come up with a better formula
        maxLevel: E(1000),
        // el: () => getUpgDefaults().keepCreditsOnUpgrade.keep,
        el: () => Boolean(Game.dataManager.getData("keepCreditsOnUpgrade") ?? false),
        effect: function (level) {
            mind.static.boost.setBoost({
                id: "boostUpg3Credits",
                name: "Basic Stats Boost",
                // description: "Basic Stats Boost",
                description: (gameFormat: GameFormatClass) => `Basic Stats Boost: ${gameFormat.multi(E.pow(2, level.sub(1)))}`,
                value: (n) => n.mul(E.pow(2, level.sub(1))),
                order: 2,
            });
        },
    },
    {
        name: "Advanced stats boost",
        id: "upg4Credits",
        cost: (n) => roundingBase(E.pow(3, n.pow(2)).mul("1e5"), 10, 1), // TODO: come up with a better formula
        maxLevel: E(1000),
        effect: function (level) {
            // Mind boosts body which boosts power
            power.static.boost.setBoost({
                id: "boostFromBody",
                name: "Boost from body",
                description: (gameFormat: GameFormatClass) => `Secondary stat boost from body: ${gameFormat.multi(secondaryStatBoost(body.value, E(1), level))}`,
                value: (n) => secondaryStatBoost(body.value, n, level),
                order: 3,
            });

            body.static.boost.setBoost({
                id: "boostFromMind",
                name: "Boost from mind",
                description: (gameFormat: GameFormatClass) => `Secondary stat boost from mind: ${gameFormat.multi(secondaryStatBoost(mind.value, E(1), level))}`,
                value: (n) => secondaryStatBoost(mind.value, n, level),
                order: 3,
            });
        },
    },
    {
        name: "Keep power on reset",
        id: "upg5Credits",
        cost: (n) => n.eq(0) ? E("1e9") : E.dInf, // TODO: come up with a better formula
        maxLevel: E(1),
        level: E(0),
        effect: function (level) {
            Game.dataManager.setData("keepPowerOnReset", level.eq(1));
        },
    },
    {
        name: "Keep credits on upgrade",
        id: "upg6Credits",
        cost: (n) => n.eq(0) ? E("1e15") : E.dInf, // TODO: come up with a better formula
        maxLevel: E(1),
        level: E(0),
        effect: function (level) {
            Game.dataManager.setData("keepCreditsOnUpgrade", level.eq(1));
        },
    },
]);

const gainCredits = (dt: ESource) => {
    credits.static.gain(dt);
};

Game.eventManager.setEvent("gainCredits", "interval", 0, gainCredits);

const getUpgDefaults = () => {
    const out = {
        power: {
            cost: credits.static.getNextCost("upg1Credits"),
            // cost: credits.static.getNextCostMax("upg1Credits"),
            boost: power.static.boost.getBoosts("boostUpg1Credits")[0].value(E(1)),
            level: credits.static.getUpgrade("upg1Credits")?.level ?? E(1),
            max: credits.static.calculateUpgrade("upg1Credits"),
            maxNext: credits.static.getNextCostMax("upg1Credits"),
        },
        body: {
            cost: credits.static.getNextCost("upg2Credits"),
            // cost: credits.static.getNextCostMax("upg2Credits"),
            boost: body.static.boost.getBoosts("boostUpg2Credits")[0].value(E(1)),
            level: credits.static.getUpgrade("upg2Credits")?.level ?? E(1),
            max: credits.static.calculateUpgrade("upg2Credits"),
            maxNext: credits.static.getNextCostMax("upg2Credits"),
        },
        mind: {
            cost: credits.static.getNextCost("upg3Credits"),
            // cost: credits.static.getNextCostMax("upg3Credits"),
            boost: mind.static.boost.getBoosts("boostUpg3Credits")[0].value(E(1)),
            level: credits.static.getUpgrade("upg3Credits")?.level ?? E(1),
            max: credits.static.calculateUpgrade("upg3Credits"),
            maxNext: credits.static.getNextCostMax("upg3Credits"),
        },
        advanced: {
            cost: credits.static.getNextCost("upg4Credits"),
            // cost: credits.static.getNextCostMax("upg4Credits"),
            boosts: {
                body: body.static.boost.getBoosts("boostFromMind")[0].value(E(1)),
                power: power.static.boost.getBoosts("boostFromBody")[0].value(E(1)),
            },
            factor: secondaryStatBoostFactor(credits.static.getUpgrade("upg4Credits")?.level ?? E(1)),
            level: credits.static.getUpgrade("upg4Credits")?.level ?? E(1),
        },
        keepPower: {
            cost: credits.static.getNextCost("upg5Credits"),
            // cost: credits.static.getNextCostMax("upg5Credits"),
            level: credits.static.getUpgrade("upg5Credits")?.level ?? E(0),
            // keep: Boolean(Game.dataManager.getData("keepPowerOnReset") ?? false),
        },
        keepCreditsOnUpgrade: {
            cost: credits.static.getNextCost("upg6Credits"),
            // cost: credits.static.getNextCostMax("upg6Credits"),
            level: credits.static.getUpgrade("upg6Credits")?.level ?? E(0),
            keep: Boolean(Game.dataManager.getData("keepCreditsOnUpgrade") ?? false),
        },
        get 1 () { return this.power; },
        get 2 () { return this.body; },
        get 3 () { return this.mind; },
        get 4 () { return this.advanced; },
        get 5 () { return this.keepPower; },
        get 6 () { return this.keepCreditsOnUpgrade; },
    };
    const exportObj: Record<number, typeof out[keyof typeof out]> = {};
    // Object.entries(out).forEach(([key, value], i) => {
    //     Object.defineProperty(exportObj, i, {
    //         get: () => value,
    //     });
    // });

    // return exportObj;
    // for (let i = 0; i < Object.entries(out).length; i++) {
    //     const [, value] = Object.entries(out);
    //     (out as Record<number, {
    //         [K in keyof typeof value]: typeof value[K]
    //     }>)[i] = value;
    // }
    // return out as typeof out & Record<number, {
    //     [K in keyof typeof Object.entries<typeof out>]: typeof Object.entries<typeof out>[K]
    // }>;
    return { ...out, ...exportObj };

};

export { credits, getUpgDefaults, gainCredits };