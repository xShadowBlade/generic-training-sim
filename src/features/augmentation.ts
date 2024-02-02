/**
 * @file Features/Augmentation - Augmentation
 */
import { E, ESource } from "emath.js";
import { rounding10 } from "./training";
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
    return E.pow(2, x.mul(1.5).pow(1.2));
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

const augments = ((augment: IAugmentInit[]) => {
    const out: IAugment[] = augment.map((augment, i) => {
        return {
            ...augment,
            req: i === 0 ? E(0) : rounding10(augmentRequirement(i)),
            mulPower: i === 0 ? E(1) : rounding10(augmentMultiplierPower(i)),
            mulCredits: i === 0 ? E(1) : rounding10(augmentMultiplierCredits(i)),
        };
    });
    return out;
})([
    {"name": "Initiate Adept", "emoji": "🔰"},
    {"name": "Tech Savant", "emoji": "🔷"},
    {"name": "Psi-Warrior", "emoji": "🔮"},
    {"name": "Cybernetic Vanguard", "emoji": "🤖"},
    {"name": "Temporal Sovereign", "emoji": "⏳"},
    {"name": "Nebula Warden", "emoji": "💫"},
    {"name": "Astral Overlord", "emoji": "✨"},
    {"name": "Stellar Arbiter", "emoji": "🌠"},
    {"name": "Quantum Overlord", "emoji": "🌌"},
]);

/**
 * Function to format an augment.
 * @param n - The augment to format.
 * @returns - The formatted augment.
 */
function formatAugment (n: number): string {
    let output = "";
    if (n < augments.length) {
        output = `${getAugment(n).emoji} | (${n}) ${getAugment(n).name}. Requires ${getAugment(n).req.format()} Power. Power Multiplier: x${getAugment(n).mulPower.format()}. Credits Multiplier: x${getAugment(n).mulCredits.format()}`;
    } else {
        output = `${augments[augments.length - 1].emoji} | (${n}) ${augments[augments.length - 1].name} ${E(n - augments.length + 1).toRoman()}. Requires ${getAugment(n).req.format()} Power. Power Multiplier: x${getAugment(n).mulPower.format()}. Credits Multiplier: x${getAugment(n).mulCredits.format()}`;
    }
    return output;
}

/**
 * Function to get an augment.
 * @param n - The augment to get.
 * @returns - The augment.
 */
function getAugment (n: number): IAugment {
    let output: IAugment;
    if (n <= augments.length - 1) {
        output = augments[n];
    } else {
        // Extended augments
        output = {
            name: augments[augments.length - 1].name,
            emoji: augments[augments.length - 1].emoji,
            req: rounding10(augmentRequirement(n)),
            mulPower: rounding10(augmentMultiplierPower(n)),
            mulCredits: rounding10(augmentMultiplierCredits(n)),
        };
    }
    return output;
}

// augments.forEach((augment, i) => {
//     console.log(i, augment.req.format(), augment.mulPower.format(), augment.mulCredits.format());
// });

/**
 * Function to change the augment.
 * @param augmentN - The augment to change to.
 * @param force - Whether to force the change, regardless of power.
 */
function changeAugment (augmentN: number, force = false) {
    // console.log(power.value.gt(getTrainingArea(areaN).req));
    if (!force && power.value.lt(getAugment(augmentN).req)) {
        console.log(`You are not strong enough for this augment. (You need ${getAugment(augmentN).req.format()} power)`);
        return;
    }
    currentAugment = augmentN;
    // playerState = ["idle", augmentN];
    // console.log(getTrainingArea(areaN).mul);
    // Reset power
    power.static.value = E(0);
    move(0, true);
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
    console.log(formatAugment(augmentN));
}
changeAugment(0, true);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (Game.config.mode === "development") (window as any)["changeAugment"] = changeAugment;

export { augments, IAugment, IAugmentInit, formatAugment, getAugment, changeAugment, currentAugment };