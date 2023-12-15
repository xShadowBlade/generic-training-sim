Game.training =  {
    areas: [
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
        {"name": "Galactic Omnipotence Citadel", "emoji": "🌠"}
    ],
    augments: [
        {"name": "Initiate Adept", "emoji": "🔰"},
        {"name": "Tech Savant", "emoji": "🔷"},
        {"name": "Psi-Warrior", "emoji": "🔮"},
        {"name": "Cybernetic Vanguard", "emoji": "🤖"},
        {"name": "Quantum Overlord", "emoji": "🌌"}
    ],
    format: (n, type = 0) => {
        let output;
        if (type == 0) {
            if (n < Game.training.areas.length - 1) {
                output = `${Game.training.areas[n].emoji} | (${n}) ${Game.training.areas[n].name}. Requires ${Game.training.areas[n].req.format()} Power. Training Multiplier: x${Game.training.areas[n].mul.format()}` 
            } else {
                output = `${Game.training.areas[Game.training.areas.length - 1].emoji} | (${n}) ${Game.training.areas[Game.training.areas.length - 1].name} ${E(n - Game.training.areas.length + 2).toRoman()}. Requires ${rounding10(requirement(n + 1)).format()} Power. Training Multiplier: x${rounding10(multiplier(n + 1)).format()}` 
            }
        } else if (type == 1) {
            if (n < Game.training.areas.length - 1) {
                output = Game.training.areas[n]
            } else {
                output = { name: Game.training.areas[Game.training.areas.length - 1].name, emoji: Game.training.areas[Game.training.areas.length - 1].emoji, req: rounding10(requirement(n + 1)), mul: rounding10(multiplier(n + 1))}
            }
        }
        return output
    }
}



function rounding10(x) { 
    const acc = 10;
    if (x.gte(Decimal.pow(10, 301))) return x;
    const power = Decimal.floor(Decimal.log(x,acc));
    let out = E(x).div(Math.pow(acc, power));
    // console.log(out);
    out = out.round();
    // console.log(out);
    out = out.mul(Math.pow(acc, power));
    // console.log(out);
    return out;
}

function requirement(x) {
    x = E(x);
    const base = E(1.1).add(x).add(E(2).pow(Decimal.mul(x, 0.5)));
    const exponent = E(x);
    const result = Decimal.mul(10, Decimal.pow(base, exponent));
    return result;
}
  
function multiplier(x) {
    x = E(x);
    return Decimal.pow(3, x.add(x.div(10).pow(1.1)).pow(1.2));
}

for (let i = 0; i < Game.training.areas.length; i++) {
    Game.training.areas[i].req = i == 0 ? E(0) : rounding10(requirement(i));
    Game.training.areas[i].mul = i == 0 ? E(1) : rounding10(multiplier(i));
}