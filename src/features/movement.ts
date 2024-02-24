/**
 * @file This file contains all the functions related to movement.
 */
import { E, ESource } from "emath.js";
import { gameCurrency } from "emath.js/game";
import { training, PowerTrainingAreaMul, MindTrainingAreaMul } from "./training";
import { multiplierBasedArea } from "utility/area";
import { power, mind, body } from "./stats";
import Game, { player } from "../game";

// let playerState: ["idle", AreaType, number] = ["idle", "power", 0];


// /**
//  * Function to move to a new power area.
//  * @param areaN - The area to to move to.
//  * @param force - Whether to force the move, regardless of power.
//  * @returns Whether the move was successful.
//  */
// function movePowerArea (areaN: number, force = false): boolean {
//     // console.log(power.value.gt(getTrainingArea(areaN).req));
//     if (!force && power.value.lt(training.power.getArea(areaN).req)) {
//         // console.log(`You are not strong enough to train in this area. (You need ${getTrainingArea(areaN).req.format()} power)`);
//         return false;
//     }
//     playerState = ["idle", areaN];
//     Game.dataManager.setData("currentArea", areaN);
//     // console.log(getTrainingArea(areaN).mul);
//     const areaToMove = training.power.getArea(areaN);
//     power.static.boost.setBoost(
//         "trainingArea",
//         "Training Area",
//         "Boost from training area",
//         (n) => {
//             // console.log("boost in", n);
//             // console.log(",mul", getTrainingArea(areaN).mul);
//             // console.log("return", E(1).mul(getTrainingArea(areaN).mul));
//             return n.mul(areaToMove.multipliers.Power);
//             // return E(1); // debug
//         },
//         2,
//     );
//     // console.log(formatTrainingArea(areaN));
//     return true;
// }

// /**
//  * Function to move to a new mind area.
//  * @param areaN - The area to to move to.
//  * @param force - Whether to force the move, regardless of power.
//  * @returns Whether the move was successful.
//  */
// function moveMindArea (areaN: number, force = false): boolean {
//     // console.log(power.value.gt(getTrainingArea(areaN).req));
//     if (!body && mind.value.lt(training.body.getArea(areaN).req)) {
//         // console.log(`You are not strong enough to train in this area. (You need ${getTrainingArea(areaN).req.format()} power)`);
//         return false;
//     }
//     playerState = ["idle", areaN];
//     Game.dataManager.setData("currentArea", areaN);
//     // console.log(getTrainingArea(areaN).mul);
//     const areaToMove = training.body.getArea(areaN);
//     body.static.boost.setBoost(
//         "trainingArea",
//         "Training Area",
//         "Boost from training area",
//         (n) => {
//             // console.log("boost in", n);
//             // console.log(",mul", getTrainingArea(areaN).mul);
//             // console.log("return", E(1).mul(getTrainingArea(areaN).mul));
//             return n.mul(areaToMove.multipliers.Body);
//             // return E(1); // debug
//         },
//         2,
//     );
//     // console.log(formatTrainingArea(areaN));
//     return true;
// }

// /**
//  * Function to move to a new body area.
//  * @param areaN - The area to to move to.
//  * @param force - Whether to force the move, regardless of power.
//  * @returns - Whether the move was successful.
//  */
// function moveBodyArea (areaN: number, force = false): boolean {
//     // console.log(power.value.gt(getTrainingArea(areaN).req));
//     if (!force && mind.value.lt(training.mind.getArea(areaN).req)) {
//         // console.log(`You are not strong enough to train in this area. (You need ${getTrainingArea(areaN).req.format()} power)`);
//         return false;
//     }
//     playerState = ["idle", areaN];
//     Game.dataManager.setData("currentArea", areaN);
//     // console.log(getTrainingArea(areaN).mul);
//     const areaToMove = training.mind.getArea(areaN);
//     mind.static.boost.setBoost(
//         "trainingArea",
//         "Training Area",
//         "Boost from training area",
//         (n) => {
//             // console.log("boost in", n);
//             // console.log(",mul", getTrainingArea(areaN).mul);
//             // console.log("return", E(1).mul(getTrainingArea(areaN).mul));
//             return n.mul(areaToMove.multipliers.Mind);
//             // return E(1); // debug
//         },
//         2,
//     );
//     // console.log(formatTrainingArea(areaN));
//     return true;
// }

type AreaType = "power" | "mind" | "body";

/**
 * Function to move to a new area.
 * @param areaType - The area type to move to.
 * @param areaN - The area to to move to.
 * @param force - Whether to force the move, regardless of power.
 * @returns - Whether the move was successful.
 */
function moveArea (areaType: AreaType, areaN: number, force = false): boolean {
    let currency: gameCurrency;
    let trainingArea: ReturnType<typeof multiplierBasedArea.prototype.getArea>;
    let multiplier: E;

    switch (areaType) {
    case "power":
        currency = power;
        trainingArea = training.power.getArea(areaN);
        multiplier = trainingArea.multipliers.Power;
        break;
    case "mind":
        currency = mind;
        trainingArea = training.mind.getArea(areaN);
        multiplier = trainingArea.multipliers.Mind;
        break;
    case "body":
        currency = body;
        trainingArea = training.body.getArea(areaN);
        multiplier = trainingArea.multipliers.Body;
        break;
    default:
        throw new Error(`Invalid area type: ${areaType}`);
    }

    if (!force && currency.value.lt(trainingArea.req)) {
        return false;
    }
    // Game.dataManager.setData("currentArea", areaN);
    // playerState = ["idle", areaType, areaN];
    // player.training = {
    //     type: areaType,
    //     area: areaN,
    // };
    // player.training.area = areaN;
    // player.training.type = areaType;
    player.training = {
        ...player.training,
        current: areaType,
        [`${areaType}Area`]: areaN,
    };
    Game.dataManager.setData("player", player);

    currency.static.boost.setBoost(
        "trainingArea",
        "Training Area",
        "Boost from training area",
        (n) => n.mul(multiplier),
        2,
    );

    return true;
}

const move = {
    // power: movePowerArea,
    // mind: moveMindArea,
    // body: moveBodyArea,
    power: (n: number, force = false) => moveArea("power", n, force),
    mind: (n: number, force = false) => moveArea("mind", n, force),
    body: (n: number, force = false) => moveArea("body", n, force),
};

// addStartFunction(() => Game.functions.move(Game.data.player.state[1]));
// movePowerArea(0, true);
// moveMindArea(0, true);
// moveBodyArea(0, true);
// move.power(0, true);
// move.mind(0, true);
// move.body(0, true);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// if (Game.config.mode === "development") (window as any)["move"] = move;

export { move, AreaType };