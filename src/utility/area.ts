/**
 * @file Declare a class to represent multiplier based training areas or other similar features.
 */
import { E, ESource } from "emath.js";
import { gameCurrency, Pointer } from "emath.js/game";
// import { power, mind } from "./stats";
interface BaseArea {
    name: string;
    emoji: string;
}

interface MultiplierType { [key: string]: (x: ESource) => E }

/**
 * Class to represent multiplier based training areas or other similar features.
 * @template Multipliers - The type of the multipliers for the training areas. Should be of type `Record<string, (x: ESource) => E>`.
 */
class multiplierBasedArea<Multipliers> {
    public stat: gameCurrency;
    public areas: BaseArea[];
    protected req: (x: ESource) => E;
    protected multipliers: Multipliers;

    /**
     * Creates a new training area.
     * @param stat - The currency to use.
     * @param areas - The areas to use.
     * @param req - The requirement function to use.
     * @param multipliers - The multipliers to use. Note: The multipliers should be functions that take a Decimal and return a Decimal.
     * The multiplier keys are also used to format the training area, so they should be capitalized or otherwise formatted correctly.
     */
    constructor (stat: Pointer<gameCurrency>, areas: BaseArea[], req: (x: ESource) => E, multipliers: Multipliers) {
        // this.stat = stat;
        this.stat = typeof stat === "function" ? stat() : stat;
        this.areas = areas;
        this.req = req;
        this.multipliers = multipliers;

        // Bind functions (idk why `this` is undefined sometimes)
        this.getArea = this.getArea.bind(this);
        this.formatArea = this.formatArea.bind(this);
    }

    /**
     * Function to get a training area.
     * TODO: Fix multipliers type
     * @param n - The area to get.
     * @returns - The training area.
     */
    public getArea (n: number): (BaseArea & { req: E } & { multipliers: Record<keyof Multipliers, E> }) {
        const isExtended = n > this.areas.length - 1;
        const mul = (() => {
            const out: Record<string, E> = {};
            for (const key in this.multipliers) {
                out[key] = (this.multipliers as any)[key](n);
            }
            return out as Record<keyof Multipliers, E>;
        })();
        return {
            name: this.areas[isExtended ? this.areas.length - 1 : n].name,
            emoji: this.areas[isExtended ? this.areas.length - 1 : n].emoji,
            req: n !== 0 ? this.req(n) : E(0),
            multipliers: mul,
        };
    }

    /**
     * Function to format a training area.
     * @param n - The area to format.
     * @param formatFn - The format function to use.
     * @returns - The formatted area.
     */
    public formatArea (n: number, formatFn: typeof E.format | ((x: ESource) => string) = E.format): string {
        // console.log("formatfn", formatFn);
        const isExtended = n > this.areas.length - 1;
        const { name, emoji, req, multipliers } = this.getArea(n);
        const statName = this.stat.name ? ` ${this.stat.name}` : "";
        const multipliersStr = Object.keys(multipliers).map(key => `${key} Multiplier: x${formatFn((multipliers as any)[key])}`).join(". ");
        return `${emoji} | (${n}) ${name}${isExtended ? " " + E(n - this.areas.length + 2).toRoman() : ""}. Requires ${formatFn(req)}${statName}. ${multipliersStr}`;
    }
}

export { multiplierBasedArea, BaseArea, MultiplierType };