/**
 * @file Features/Quests - Quests
 */
import { E } from "emath.js";
// import Game from "../game";
import { rounding10 } from "./training";
import { power } from "./stats";
import { credits } from "./credits";

interface IQuest {
    name: string;
    id: string;
    req: () => boolean;
    effect: () => void;
}

const quests: IQuest[] = [
    {
        name: "Beginner's Luck",
        id: "quest1",
        req: () => power.value.gte(100),
        effect: () => {
            credits.static.gain(E(1e6));
        },
    },
];