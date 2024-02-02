/**
 * @file Features/Credits - Credits
 */
import { E } from "emath.js";
import Game from "../game";
import { power } from "./stats";
import { rounding10 } from "./training";

const credits = Game.addCurrency("credits");

credits.static.addUpgrade([
    {
        name: "Basic Stat Boost",
        id: "upg1Credits",
        // costScaling: n => E.pow(1.2, E.scale(E(n), 1e6, 2, 0)).mul(10).ceil(),
        cost: n => E.pow(n, 2).mul(10), // TODO: come up with a better formula
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
]);

Game.eventManager.setEvent("gainCredits", "interval", 0, (dt) => {
    credits.static.gain(dt);
});

export { credits };