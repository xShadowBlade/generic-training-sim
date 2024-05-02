/**
 * @file Features - Upgrades
 */
import { E, ESource, roundingBase } from "emath.js";
// import { GameCurrency } from "emath.js/game";
import { power, mind, body } from "./stats";
import { BaseArea, multiplierBasedArea } from "../utility/area";

// Note: irregular names are intentional, as they are used to format the training area
interface PowerTrainingAreaMul {
    Power: (x: ESource) => E;
    // mulCredits: E;
}

interface MindTrainingAreaMul {
    Mind: (x: ESource) => E;
}

const powerAreaList: BaseArea[] = [
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

    { name: "Quantum Harmonics Nexus", emoji: "🎵" },
    { name: "Celestial Ascendancy Coliseum", emoji: "🏟️" },
    { name: "Astro-Forge Cathedral", emoji: "🏰" },
    { name: "Hypernova Mastery Observatory", emoji: "🔭" },
    { name: "Stellar Nexus Bastion", emoji: "🌌" },
    { name: "Nebula Resonance Sanctum", emoji: "💫" },
    { name: "Ethereal Synthesis Chamber", emoji: "🌈" },
    { name: "Quantum Elysium Arena", emoji: "⚔️" },
    { name: "Cosmic Apex Observatory", emoji: "🔍" },
    { name: "Galactic Singularity Citadel", emoji: "🌠" },
];

/**
 * Function to calculate the requirement for a given area.
 * @param x - The area to calculate the requirement for.
 * @returns - The requirement for the given area.
 */
function requirement (x: ESource): E {
    x = E(x);
    const base = x.mul(2).add(E.pow(2, x.div(1.9)));
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

// TODO: Make unique areas, requirements, and multipliers for mind training
const powerTraining = (() => {
    return new multiplierBasedArea<PowerTrainingAreaMul>(power, powerAreaList, (x: ESource) => roundingBase(requirement(x)), { Power: (x: ESource) => roundingBase(multiplier(x)) });
})();

// Test
// console.log(powerTraining.getArea(2).multipliers.Power);

const mindTraining = (() => {
    // TODO: Make unique areas, requirements, and multipliers for mind training
    const mindAreaList = powerAreaList;
    const req = (x: ESource) => E(x).neq(0) ? roundingBase(requirement(x).mul(3)) : E(0);
    const mul = (x: ESource) => E(x).neq(0) ? roundingBase(multiplier(x).div(3)) : E(0.3);
    return new multiplierBasedArea<MindTrainingAreaMul>(mind, mindAreaList, req, { Mind: mul });
})();

const bodyTraining = (() => {
    // TODO: Make unique areas, requirements, and multipliers for body training
    const bodyAreaList = powerAreaList;
    const req = (x: ESource) => E(x).neq(0) ? roundingBase(requirement(x).mul(2)) : E(0);
    const mul = (x: ESource) => E(x).neq(0) ? roundingBase(multiplier(x).div(2)) : E(0.5);
    return new multiplierBasedArea(body, bodyAreaList, req, { Body: mul });
})();

const training = {
    power: powerTraining,
    mind: mindTraining,
    body: bodyTraining,
};

// export { training, formatTrainingArea, getTrainingArea, requirement, multiplier };
export { powerAreaList, powerTraining, mindTraining, training, requirement, multiplier, PowerTrainingAreaMul, MindTrainingAreaMul };