/**
 * @file Combat features
 */

import { E, ESource } from "emath.js";
import { Pointer } from "emath.js/game";
import { power, mind } from "./stats";

/**
 * Entity class
 */
class entity {
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
     * @param stats - The stats of the entity
     */
    constructor (stats: typeof entity.prototype.stats) {
        this.stats = stats;
    }
}

/**
 * Player class
 */
class player<T> extends entity {
    public stats: T;
    constructor (stats: T) {
        
        this.stats = stats;
    }
}