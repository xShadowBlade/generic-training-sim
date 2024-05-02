/**
 * @file Combat features
 */

import { E, ESource, roundingBase } from "emath.js";
import { Pointer } from "emath.js/game";
import { power, body, mind } from "./stats";

/**
 * Entity class
 */
class entity {
    public level: E;
    public stats: {
        health: E;
        maxHealth: E;
        damage: E;
        // TODO: Add more stats
        // defense: E;
        // speed: E;
        // accuracy: E;
        // evasion: E;
        // critical: E;
        // criticalDamage: E;
        // resistance: E;
        // regeneration: E;
    };
    /**
     * Create a new entity
     * @param level - The level of the entity
     * @param stats - The stats of the entity
     */
    constructor (level: E) {
        this.level = level;
        this.stats = {
            health: roundingBase(level.pow(1.2).mul(10), 10, 3),
            maxHealth: roundingBase(level.pow(1.25).mul(20), 10, 3),
            damage: roundingBase(level.pow(1.15).mul(5), 10, 3),
        };
        // this.stats = stats;
    }
}

/**
 * Player class
 */
class player extends entity {
    constructor () {
        super(E(1));
    }
}