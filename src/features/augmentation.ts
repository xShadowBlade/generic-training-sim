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
    // {"name": "Astral Overlord", "emoji": "✨"},
    // {"name": "Stellar Arbiter", "emoji": "🌠"},
    // {"name": "Eternal Nexus Guardian", "emoji": "🌌"},
    // {"name": "Quantum Paragon", "emoji": "👑"},
    // {"name": "Celestial Maestro", "emoji": "🎶"},
    // {"name": "Astral Sovereign", "emoji": "🌠"},
    // {"name": "Stellar Virtuoso", "emoji": "💫"},
    // {"name": "Nebula Luminary", "emoji": "🌌"},
    // {"name": "Cosmic Mastermind", "emoji": "🧠"},
    {"name": "Quantum Overlord", "emoji": "🌌"},
]);

/**
 * Function to format an augment.
 * @param n - The augment to format.
 * @param formatFn - The format function to use.
 * @returns - The formatted augment.
 */
function formatAugment (n: number, formatFn: typeof E.format | ((x: ESource) => string) = E.format): string {
    let output = "";
    if (n < augments.length) {
        output = `${getAugment(n).emoji} | (${n}) ${getAugment(n).name}. Requires ${formatFn(getAugment(n).req)} Power. Power Multiplier: x${formatFn(getAugment(n).mulPower)}. Credits Multiplier: x${formatFn(getAugment(n).mulCredits)}`;
    } else {
        output = `${augments[augments.length - 1].emoji} | (${n}) ${augments[augments.length - 1].name} ${E(n - augments.length + 1).toRoman()}. Requires ${formatFn(getAugment(n).req)} Power. Power Multiplier: x${formatFn(getAugment(n).mulPower)}. Credits Multiplier: x${formatFn(getAugment(n).mulCredits)}`;
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
        // console.log(`You are not strong enough for this augment. (You need ${getAugment(augmentN).req.format()} power)`);
        return false;
    }
    currentAugment = augmentN;
    Game.dataManager.setData("currentAugment", augmentN);
    // playerState = ["idle", augmentN];
    // console.log(getTrainingArea(areaN).mul);
    // Reset power
    if (reset) {
        // power.static.value = E(0);
        power.static.reset();
        move(0, true);
        if (stateFn) stateFn(formatTrainingArea(0, formatFn));
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