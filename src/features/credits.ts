/**
 * @file Features/Credits - Credits and upgrades
 */
import { E, ESource } from "emath.js";
import Game from "../game";
import { power, body, mind } from "./stats";
import { rounding10 } from "./training";
import { gameFormatClass } from "../display/global/format";

const credits = Game.addCurrency("credits");

const upgCostFormula = (n: E) => rounding10(E.pow(1.2, n.pow(1.15)).mul(10), 10, 1);

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
    };
};

export { credits, getUpgDefaults, gainCredits };