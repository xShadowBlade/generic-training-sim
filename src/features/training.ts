/**
 * @file Features - Upgrades
 */
import { E, ESource } from "emath.js";

/**
 * Function to round a number to the nearest power of 10.
 * @param x - The number to round.
 * @param acc - The accuracy to round to (power)
 * @param sig - The significant figures to round to.
 * @returns - The rounded number.
 */
function rounding10 (x: E, acc = 10, sig = 0) {
    // If the number is too large, don't round it
    if (x.gte(E.pow(10, 301))) return x;
    /** The power of the number, rounded. acc^power = x */
    const power = E.floor(E.log(x, acc));
    let out = E(x).div(E.pow(acc, power));
    out = out.mul(E.pow(acc, sig)).round();
    out = out.div(E.pow(acc, sig));
    out = out.mul(E.pow(acc, power));
    return out;
}

/**
 * Function to calculate the requirement for a given area.
 * @param x - The area to calculate the requirement for.
 * @returns - The requirement for the given area.
 */
function requirement (x: ESource): E {
    x = E(x);
    const base = x.mul(2).add(E(2).pow(E.mul(x, 0.5)));
    const exponent = x;
    const result = E.mul(10, E.pow(base, exponent));
    return result;
}

/**
 * Function to calculate the multiplier for a given area.
 * @param x - The area to calculate the multiplier for.
 * @returns - The multiplier for the given area.
 */
function multiplier (x: ESource): E {
    x = E(x);
    return E.pow(3, x.add(x.div(10).pow(1.2)).pow(1.4));
}

interface ITrainingAreaInit {
    name: string;
    emoji: string;
}

interface ITrainingArea extends ITrainingAreaInit {
    req: E;
    mul: E;
}

const training = {
    areas: [
        // TODO: Reword these areas
        // { name: "The Hub", emoji: "🏢" },
        // { name: "Gym", emoji: "🏋️" },
        // { name: "Stone Chamber", emoji: "" },
        // { name: "The Rocket", emoji: "🚀" },
        // { name: "Sky City", emoji: "" },
        // { name: "Asteroid", emoji: "" },
        // { name: "Space Station", emoji: "🛰️" },
        // { name: "Moon", emoji: "🌕" },
        // { name: "Planet", emoji: "🪐" },
        // { name: "White Dwarf", emoji: "" },
        // { name: "Star", emoji: "⭐" },
        // { name: "Supernova", emoji: "" },
        // { name: "Quasar", emoji: "" },
        // { name: "Galaxy", emoji: "" },
        // { name: "Black Hole", emoji: "🕳️" },
        // { name: "Universe Citadel", emoji: "" },
        { name: "The Hub", emoji: "🏢" },
        { name: "Initiate's Haven", emoji: "🚀" },
        { name: "Tech Novice Quarters", emoji: "💻" },
        { name: "Psi Potential Chamber", emoji: "🔮" },
        { name: "Cybernetic Playground", emoji: "🤖" },
        { name: "Quantum Nexus Hub", emoji: "🌌" },
        { name: "Astro-Simulation Deck", emoji: "🛰️" },
        { name: "Nanobot Mastery Lab", emoji: "🔬" },
        { name: "Temporal Anomaly Arena", emoji: "⏳" },
        { name: "Dimensional Rift Chamber", emoji: "🌀" },
        { name: "Xeno-Adaptation Zone", emoji: "👽" },
        { name: "Cosmic Ascendancy Spire", emoji: "🌠" },
        { name: "Hyper-Tech Bastion", emoji: "🔷" },
        { name: "Astral Mastery Chamber", emoji: "✨" },
        { name: "Neural Singularity Nexus", emoji: "🧠" },
        { name: "Chrono-Warper Citadel", emoji: "⏰" },
        { name: "Stellar Phenomenon Pinnacle", emoji: "💫" },
        { name: "Exo-Dimensional Observatory", emoji: "🌌" },
        { name: "Temporal Nexus Chamber", emoji: "⏳" },
        { name: "Nanite Cosmos Forges", emoji: "🌐" },
        { name: "Celestial Xenogenesis Sanctum", emoji: "🌟" },
        { name: "Quantum Anomaly Atrium", emoji: "🌌" },
        { name: "Nebula Resonance Chamber", emoji: "💫" },
        { name: "Astro-Techno Cathedral", emoji: "🚀" },
        { name: "Temporal Mastery Sphere", emoji: "⏳" },
        { name: "Galactic Omnipotence Citadel", emoji: "🌠" },

        // { name: "Quantum Harmonics Nexus", emoji: "🎵" },
        // { name: "Celestial Ascendancy Coliseum", emoji: "🏟️" },
        // { name: "Astro-Forge Cathedral", emoji: "🏰" },
        // { name: "Hypernova Mastery Observatory", emoji: "🔭" },
        // { name: "Stellar Nexus Bastion", emoji: "🌌" },
        // { name: "Nebula Resonance Sanctum", emoji: "💫" },
        // { name: "Ethereal Synthesis Chamber", emoji: "🌈" },
        // { name: "Quantum Elysium Arena", emoji: "⚔️" },
        // { name: "Cosmic Apex Observatory", emoji: "🔍" },
        // { name: "Galactic Singularity Citadel", emoji: "🌠" },
    ],
};

/**
 * Function to format a training area.
 * @param n - The area to format.
 * @param formatFn - The format function to use.
 * @returns - The formatted area.
 */
function formatTrainingArea (n: number, formatFn: typeof E.format | ((x: ESource) => string) = E.format): string {
    const isExtended = n > training.areas.length - 1;
    const { name, emoji, req, mul } = getTrainingArea(n);
    return `${emoji} | (${n}) ${name} ${isExtended ? E(n - training.areas.length + 2).toRoman() : ""}. Requires ${formatFn(req)} Power. Training Multiplier: x${formatFn(mul)}`;
}

/**
 * Function to get a training area.
 * @param n - The area to get.
 * @returns - The training area.
 */
function getTrainingArea (n: number): ITrainingArea {
    // let output: ITrainingArea;
    const isExtended = n > training.areas.length - 1;
    return {
        name: training.areas[isExtended ? training.areas.length - 1 : n].name,
        emoji: training.areas[isExtended ? training.areas.length - 1 : n].emoji,
        req: n !== 0 ? rounding10(requirement(n)) : E(0),
        mul: n !== 0 ? rounding10(multiplier(n)) : E(1),
    };
}
(window as any).getTrainingArea = getTrainingArea; // debug

export { training, formatTrainingArea, getTrainingArea, rounding10, requirement, multiplier };