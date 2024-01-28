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

Game.eventManager.addEvent("gainCredits", "interval", 1000, (dt) => {
    credits.static.gain(dt);
    // TODO: Add display for credits
    const creditsElement = document.getElementById("credits") as HTMLElement;
    creditsElement.innerHTML = `🪙 | Credits: ${credits.value.format()}`;
});

// addLoopFunction((dt) => {
//     Game.static.credits.currency.gain(dt);
//     document.getElementById("credits").innerHTML = `🪙 | Credits: ${Game.data.credits.currency.value.format()}`;
// });

export { credits };