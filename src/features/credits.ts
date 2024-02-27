/**
 * @file Features/Credits - Credits and upgrades
 */
import { E, ESource } from "emath.js";
import Game from "../game";
import { power, body, mind } from "./stats";
import { rounding10 } from "./training";
import { gameFormatClass } from "../display/global/format";

const credits = Game.addCurrency("credits");

const upgCostFormula = (n: E) => rounding10(E.pow(1.2, n.pow(1.2)).mul(10), 10, 1);

const secondaryStatBoost = (n: E, x: E, level: E) => x.mul(n.add(1).div(1000).pow(secondaryStatBoostFactor(level)).add(0.5));
const secondaryStatBoostFactor = (level: E) => level.pow(0.125).sub(0.9);

credits.static.addUpgrade([
    {
        name: "Basic Power Boost",
        id: "upg1Credits",
        cost: upgCostFormula, // TODO: come up with a better formula
        maxLevel: E(1000),
        effect: function (level) {
            // console.log(this);
            // const level = this.getLevel();

            // power.static.boost.setBoost(
            //     "boostUpg1Credits",
            //     "Basic Stats Boost",
            //     "Basic Stats Boost",
            //     // n => n.mul(E.floor(E.mul(0.5, level).mul(E.ln(level)).add(level))),
            //     n => n.mul(E.pow(2, level.sub(1))),
            //     2,
            // );
            power.static.boost.setBoost({
                id: "boostUpg1Credits",
                name: "Basic Stats Boost",
                // description: "Basic Stats Boost",
                description: (gameFormat: gameFormatClass) => `Basic Stats Boost: ${gameFormat.multi(E.pow(2, level.sub(1)))}`,
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
        effect: function (level) {
            // body.static.boost.setBoost(
            //     "boostUpg2Credits",
            //     "Basic Stats Boost",
            //     "Basic Stats Boost",
            //     n => n.mul(E.pow(2, level.sub(1))),
            //     2,
            // );
            body.static.boost.setBoost({
                id: "boostUpg2Credits",
                name: "Basic Stats Boost",
                // description: "Basic Stats Boost",
                description: (gameFormat: gameFormatClass) => `Basic Stats Boost: ${gameFormat.multi(E.pow(2, level.sub(1)))}`,
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
        effect: function (level) {
            // mind.static.boost.setBoost(
            //     "boostUpg3Credits",
            //     "Basic Stats Boost",
            //     "Basic Stats Boost",
            //     n => n.mul(E.pow(2, level.sub(1))),
            //     2,
            // );
            mind.static.boost.setBoost({
                id: "boostUpg3Credits",
                name: "Basic Stats Boost",
                // description: "Basic Stats Boost",
                description: (gameFormat: gameFormatClass) => `Basic Stats Boost: ${gameFormat.multi(E.pow(2, level.sub(1)))}`,
                value: (n) => n.mul(E.pow(2, level.sub(1))),
                order: 2,
            });
        },
    },
    {
        name: "Advanced stats boost",
        id: "upg4Credits",
        cost: (n) => rounding10(E.pow(3, n.pow(2)).mul("1e5"), 10, 1), // TODO: come up with a better formula
        maxLevel: E(1000),
        effect: function (level) {
            // Mind boosts body which boosts power
            power.static.boost.setBoost({
                id: "boostFromBody",
                name: "Boost from body",
                description: (gameFormat: gameFormatClass) => `Secondary stat boost from body: ${gameFormat.multi(secondaryStatBoost(body.value, E(1), level))}`,
                value: (n) => secondaryStatBoost(body.value, n, level),
                order: 3,
            });

            body.static.boost.setBoost({
                id: "boostFromMind",
                name: "Boost from mind",
                description: (gameFormat: gameFormatClass) => `Secondary stat boost from mind: ${gameFormat.multi(secondaryStatBoost(mind.value, E(1), level))}`,
                value: (n) => secondaryStatBoost(mind.value, n, level),
                order: 3,
            });
        },
    },
]);

const gainCredits = (dt: ESource) => {
    credits.static.gain(dt);
};

Game.eventManager.setEvent("gainCredits", "interval", 0, gainCredits);

const getUpgDefaults = () => {
    return {
        power: {
            cost: credits.static.getNextCost("upg1Credits"),
            boost: power.static.boost.getBoosts("boostUpg1Credits")[0].value(E(1)),
            level: credits.static.getUpgrade("upg1Credits")?.level ?? E(1),
        },
        body: {
            cost: credits.static.getNextCost("upg2Credits"),
            boost: body.static.boost.getBoosts("boostUpg2Credits")[0].value(E(1)),
            level: credits.static.getUpgrade("upg2Credits")?.level ?? E(1),
        },
        mind: {
            cost: credits.static.getNextCost("upg3Credits"),
            boost: mind.static.boost.getBoosts("boostUpg3Credits")[0].value(E(1)),
            level: credits.static.getUpgrade("upg3Credits")?.level ?? E(1),
        },
        advanced: {
            cost: credits.static.getNextCost("upg4Credits"),
            boosts: {
                body: body.static.boost.getBoosts("boostFromMind")[0].value(E(1)),
                power: power.static.boost.getBoosts("boostFromBody")[0].value(E(1)),
            },
            factor: secondaryStatBoostFactor(credits.static.getUpgrade("upg4Credits")?.level ?? E(1)),
            level: credits.static.getUpgrade("upg4Credits")?.level ?? E(1),
        },
    };
};

export { credits, getUpgDefaults, gainCredits };