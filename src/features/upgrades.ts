/**
 * @file Features - Upgrades
 */
import { E, ESource } from "emath.js";

/**
 * Function to round a number to the nearest power of 10.
 * @param x - The number to round.
 * @returns - The rounded number.
 */
function rounding10 (x: E) {
    const acc = 10;
    if (x.gte(E.pow(10, 301))) return x;
    const power = E.floor(E.log(x, acc));
    let out = E(x).div(E.pow(acc, power));
    // console.log(out);
    out = out.round();
    // console.log(out);
    out = out.mul(E.pow(acc, power));
    // console.log(out);
    return out;
}

/**
 * Function to calculate the requirement for a given area.
 * @param x - The area to calculate the requirement for.
 * @returns - The requirement for the given area.
 */
function requirement (x: ESource) {
    x = E(x);
    const base = E(1.1).add(x).add(E(2).pow(E.mul(x, 0.5)));
    const exponent = E(x);
    const result = E.mul(10, E.pow(base, exponent));
    return result;
}

/**
 * Function to calculate the multiplier for a given area.
 * @param x - The area to calculate the multiplier for.
 * @returns - The multiplier for the given area.
 */
function multiplier (x: ESource) {
    x = E(x);
    return E.pow(3, x.add(x.div(10).pow(1.1)).pow(1.2));
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
    areas: ((areas: ITrainingAreaInit[]): ITrainingArea[] => {
        const out: ITrainingArea[] = areas.map((area, i) => {
            return {
                ...area,
                req: i === 0 ? E(0) : rounding10(requirement(i)),
                mul: i === 0 ? E(1) : rounding10(multiplier(i)),
            } as ITrainingArea;
        });
        return out;
    })([
        {"name": "The Hub", "emoji": "🏢"},
        {"name": "Initiate's Haven", "emoji": "🚀"},
        {"name": "Tech Novice Quarters", "emoji": "💻"},
        {"name": "Psi Potential Chamber", "emoji": "🔮"},
        {"name": "Cybernetic Playground", "emoji": "🤖"},
        {"name": "Quantum Nexus Hub", "emoji": "🌌"},
        {"name": "Astro-Simulation Deck", "emoji": "🛰️"},
        {"name": "Nanobot Mastery Lab", "emoji": "🔬"},
        {"name": "Temporal Anomaly Arena", "emoji": "⏳"},
        {"name": "Dimensional Rift Chamber", "emoji": "🌀"},
        {"name": "Xeno-Adaptation Zone", "emoji": "👽"},
        {"name": "Cosmic Ascendancy Spire", "emoji": "🌠"},
        {"name": "Hyper-Tech Bastion", "emoji": "🔷"},
        {"name": "Astral Mastery Chamber", "emoji": "✨"},
        {"name": "Neural Singularity Nexus", "emoji": "🧠"},
        {"name": "Chrono-Warper Citadel", "emoji": "⏰"},
        {"name": "Stellar Phenomenon Pinnacle", "emoji": "💫"},
        {"name": "Exo-Dimensional Observatory", "emoji": "🌌"},
        {"name": "Temporal Nexus Chamber", "emoji": "⏳"},
        {"name": "Nanite Cosmos Forges", "emoji": "🌐"},
        {"name": "Celestial Xenogenesis Sanctum", "emoji": "🌟"},
        {"name": "Quantum Anomaly Atrium", "emoji": "🌌"},
        {"name": "Nebula Resonance Chamber", "emoji": "💫"},
        {"name": "Astro-Techno Cathedral", "emoji": "🚀"},
        {"name": "Temporal Mastery Sphere", "emoji": "⏳"},
        {"name": "Galactic Omnipotence Citadel", "emoji": "🌠"},
    ] as ITrainingAreaInit[]),
    augments: [
        {"name": "Initiate Adept", "emoji": "🔰"},
        {"name": "Tech Savant", "emoji": "🔷"},
        {"name": "Psi-Warrior", "emoji": "🔮"},
        {"name": "Cybernetic Vanguard", "emoji": "🤖"},
        {"name": "Quantum Overlord", "emoji": "🌌"},
    ],
};

/**
 * Function to format a training area.
 * @param n - The area to format.
 * @returns - The formatted area.
 */
function formatTrainingArea (n: number): string {
    let output = "";
    if (n < training.areas.length - 1) {
        output = `${training.areas[n].emoji} | (${n}) ${training.areas[n].name}. Requires ${training.areas[n].req.format()} Power. Training Multiplier: x${training.areas[n].mul.format()}`;
    } else {
        output = `${training.areas[training.areas.length - 1].emoji} | (${n}) ${training.areas[training.areas.length - 1].name} ${E(n - training.areas.length + 2).toRoman()}. Requires ${rounding10(requirement(n + 1)).format()} Power. Training Multiplier: x${rounding10(multiplier(n + 1)).format()}`;
    }
    return output;
}

/**
 * Function to get a training area.
 * @param n - The area to get.
 * @returns - The training area.
 */
function getTrainingArea (n: number): ITrainingArea {
    let output: ITrainingArea;
    if (n < training.areas.length - 1) {
        output = training.areas[n];
    } else {
        // Extended training areas
        output = {
            name: training.areas[training.areas.length - 1].name,
            emoji: training.areas[training.areas.length - 1].emoji,
            req: rounding10(requirement(n + 1)),
            mul: rounding10(multiplier(n + 1)),
        };
    }
    return output;
}

export { training, formatTrainingArea, getTrainingArea, rounding10, requirement, multiplier};