/**
 * @file Features/Augmentation - Augmentation
 */
import { E, ESource } from "emath.js";
import { rounding10, formatTrainingArea } from "./training";
import { power } from "./stats";
import { credits } from "./credits";
import Game from "../game";
import { move } from "./movement";

let currentAugment = 0;

/**
 * Function to calculate the requirement for a given augment.
 * @param x - The augment to calculate the requirement for.
 * @returns - The requirement for the given augment.
 */
function augmentRequirement (x: ESource) {
    x = E(x);
    const base = x.mul(30).add(E(2).pow(x));
    const exponent = x.mul(5);
    const result = E.pow(base, exponent).mul("250e12");
    return result;
}

/**
 * Function to calculate the multiplier for a given augment.
 * @param x - The augment to calculate the multiplier for.
 * @returns - The multiplier for the given augment.
 */
function augmentMultiplierPower (x: ESource) {
    x = E(x);
    return E.pow(2, x.add(x.pow(1.4)).pow(1.5)).mul(10);
}

/**
 * Function to calculate the multiplier for a given augment.
 * @param x - The augment to calculate the multiplier for.
 * @returns - The multiplier for the given augment.
 */
function augmentMultiplierCredits (x: ESource) {
    x = E(x);
    return E.pow(2, x.mul(2).pow(1.3));
}

interface IAugmentInit {
    name: string;
    emoji: string;
}

interface IAugment extends IAugmentInit {
    req: E;
    mulPower: E;
    mulCredits: E;
}

const augments: IAugmentInit[] = [
    { name: "Initiate", emoji: "🔰" },
    { name: "Warrior", emoji: "🔷" },
    { name: "Vanguard", emoji: "🔮" },
    { name: "Sovereign", emoji: "🌠" },
    { name: "Luminary", emoji: "🧠" },
    { name: "Ethereal", emoji: "🌌" },
    { name: "Paragon", emoji: "⭐️" },
    { name: "Overlord", emoji: "👑" },
    // { name: "Stellar Arbiter", emoji: "🌠" },
    // { name: "Eternal Nexus Guardian", emoji: "🌌" },
    // { name: "Quantum Paragon", emoji: "👑" },
    // { name: "Celestial Maestro", emoji: "🎶" },
    // { name: "Astral Sovereign", emoji: "🌠" },
    // { name: "Stellar Virtuoso", emoji: "💫" },
    // { name: "Nebula Luminary", emoji: "🌌" },
    // { name: "Cosmic Mastermind", emoji: "🧠" },
];

/**
 * Function to format an augment.
 * @param n - The augment to format.
 * @param formatFn - The format function to use.
 * @returns - The formatted augment.
 */
function formatAugment (n: number, formatFn: typeof E.format | ((x: ESource) => string) = E.format): string {
    // let output = "";
    // if (n < augments.length) {
    //     output = `${getAugment(n).emoji} | (${n}) ${getAugment(n).name}. Requires ${formatFn(getAugment(n).req)} Power. Power Multiplier: x${formatFn(getAugment(n).mulPower)}. Credits Multiplier: x${formatFn(getAugment(n).mulCredits)}`;
    // } else {
    //     output = `${augments[augments.length - 1].emoji} | (${n}) ${augments[augments.length - 1].name} ${E(n - augments.length + 1).toRoman()}. Requires ${formatFn(getAugment(n).req)} Power. Power Multiplier: x${formatFn(getAugment(n).mulPower)}. Credits Multiplier: x${formatFn(getAugment(n).mulCredits)}`;
    // }
    // return output;
    const isExtended = n > augments.length - 1;
    const { name, emoji, req, mulPower, mulCredits } = getAugment(n);
    return `${emoji} | (${n}) ${name} ${isExtended ? E(n - augments.length + 2).toRoman() : ""}. Requires ${formatFn(req)} Power. Power Multiplier: x${formatFn(mulPower)}. Credits Multiplier: x${formatFn(mulCredits)}`;
}

/**
 * Function to get an augment.
 * @param n - The augment to get.
 * @returns - The augment.
 */
function getAugment (n: number): IAugment {
    // let output: IAugment;
    const isExtended = n > augments.length - 1;
    return {
        name: augments[isExtended ? augments.length - 1 : n].name,
        emoji: augments[isExtended ? augments.length - 1 : n].emoji,
        req: n !== 0 ? rounding10(augmentRequirement(n)) : E(0),
        mulPower: n !== 0 ? rounding10(augmentMultiplierPower(n)) : E(1),
        mulCredits: n !== 0 ? rounding10(augmentMultiplierCredits(n)) : E(1),
    };
}

// augments.forEach((augment, i) => {
//     console.log(i, augment.req.format(), augment.mulPower.format(), augment.mulCredits.format());
// });

const checkAugment = (augmentN: number): boolean => power.value.gt(getAugment(augmentN).req);

/**
 * Function to change the augment.
 * @param augmentN - The augment to change to.
 * @param reset - Whether to reset the power.
 * @param force - Whether to force the change, regardless of power.
 * @param stateFn - The function to call to change the state.
 * @param formatFn - The format function to use.
 * @returns - Whether the augment was changed.
 */
function changeAugment (augmentN: number, reset = true, force = false, stateFn?: (state: string) => void, formatFn: typeof E.format | ((x: ESource) => string) = E.format): boolean {
    // console.log(power.value.gt(getTrainingArea(areaN).req));
    if (!force && !checkAugment(augmentN)) {
        return false;
    }
    currentAugment = augmentN;
    Game.dataManager.setData("currentAugment", augmentN);
    // Reset power
    if (reset) {
        // power.static.value = E(0);
        power.static.reset();
        move(0, true);
        stateFn?.(formatTrainingArea(0, formatFn));
    }
    power.static.boost.setBoost(
        "augment",
        "Augment",
        "Boost from augment",
        (n) => {
            return n.mul(getAugment(augmentN).mulPower);
        },
        3,
    );
    credits.static.boost.setBoost(
        "augment",
        "Augment",
        "Boost from augment",
        (n) => {
            return n.mul(getAugment(augmentN).mulCredits);
        },
        2,
    );
    // console.log(formatAugment(augmentN));
    return true;
}
changeAugment(0, true);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (Game.config.mode === "development") (window as any)["changeAugment"] = changeAugment;

export { augments, IAugment, IAugmentInit, formatAugment, getAugment, changeAugment, checkAugment, currentAugment };