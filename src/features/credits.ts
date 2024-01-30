/**
 * @file Features/Credits - Credits
 */
import { E } from "emath.js";
import Game from "../game";
import { power } from "./stats";

const credits = Game.addCurrency("credits");

credits.static.addUpgrade([
    {
        name: "Basic Stat Boost",
        costScaling: n => E.pow(1.2, E.scale(E(n), 1e6, 2, 0)).mul(10).ceil(),
        maxLevel: E(1000),
        effect: function (level) {
            // console.log(this);
            // const level = this.getLevel();

            // power.static.boost.setBoost(
            //     "boostUpg1Credits",
            //     "Basic Stats Boost",
            //     "Basic Stats Boost",
            //     n => E(n).mul(E.floor(E.mul(0.5, level).mul(E.ln(level)).add(level))),
            //     2,
            // );
        },
    },
]);

Game.eventManager.setEvent("gainCredits", "interval", 0, (dt) => {
    credits.static.gain(dt);
});

export { credits };