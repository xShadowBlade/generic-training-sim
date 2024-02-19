/**
 * @file Features/Credits - Credits
 */
import { E } from "emath.js";
import Game from "../game";
import { power, body, mind } from "./stats";
import { rounding10 } from "./training";

const credits = Game.addCurrency("credits");

credits.static.addUpgrade([
    {
        name: "Basic Power Boost",
        id: "upg1Credits",
        cost: n => rounding10(E.pow(1.2, n.pow(1.075)).mul(10), 10, 1), // TODO: come up with a better formula
        maxLevel: E(1000),
        effect: function (level) {
            // console.log(this);
            // const level = this.getLevel();

            power.static.boost.setBoost(
                "boostUpg1Credits",
                "Basic Stats Boost",
                "Basic Stats Boost",
                // n => n.mul(E.floor(E.mul(0.5, level).mul(E.ln(level)).add(level))),
                n => n.mul(E.pow(2, level.sub(1))),
                2,
            );
        },
    },
    {
        name: "Basic Body Boost",
        id: "upg2Credits",
        cost: n => rounding10(E.pow(1.2, n.pow(1.075)).mul(10), 10, 1), // TODO: come up with a better formula
        maxLevel: E(1000),
        effect: function (level) {
            body.static.boost.setBoost(
                "boostUpg2Credits",
                "Basic Stats Boost",
                "Basic Stats Boost",
                n => n.mul(E.pow(2, level.sub(1))),
                2,
            );
        },
    },
    {
        name: "Basic Mind Boost",
        id: "upg3Credits",
        cost: n => rounding10(E.pow(1.2, n.pow(1.075)).mul(10), 10, 1), // TODO: come up with a better formula
        maxLevel: E(1000),
        effect: function (level) {
            mind.static.boost.setBoost(
                "boostUpg3Credits",
                "Basic Stats Boost",
                "Basic Stats Boost",
                n => n.mul(E.pow(2, level.sub(1))),
                2,
            );
        },
    },
]);

Game.eventManager.setEvent("gainCredits", "interval", 0, (dt) => {
    credits.static.gain(dt);
});

export { credits };