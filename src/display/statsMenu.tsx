/**
 * @file Display components
 */
import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

import { power, mind, body, StatsStored } from "../features/stats";
import { credits, getUpgDefaults } from "../features/credits";
import { player } from "../game";
import { E } from "emath.js";
import { gameFormatClass } from "./global/format";
import { AreaType } from "../features/movement";


/**
 * Buys and renders the basic stat upgrade  
 * @param setBasicStatUpgCost - The function to set the basic stat upgrade cost
 */
function buyBasicStatUpg({ setBasicStatUpg, basicStatUpg, upgType }: Pick<IStatsMenuProps, "setBasicStatUpg" | "basicStatUpg"> & { upgType: AreaType }) {
    // Function implementation
    console.log("Buying basic stat upgrade");
    const boostId = [null, "power", "body", "mind"].indexOf(upgType) ?? 1;
    credits.static.buyUpgrade(`upg${boostId}Credits`);
    // const powerBoost = power.static.boost.getBoosts("boostUpg1Credits")[0];
    // setBasicStatUpgCost({
    //     credits: credits.static.getNextCost("upg1Credits"),
    //     power: powerBoost.value(E(1)),
    // });
    // const statBoost = { power, body, mind }[upgType]?.static.boost.getBoosts(`boostUpg${boostId}Credits`)[0];
    // const newUpg = basicStatUpg;
    // newUpg[upgType] = {
    //     cost: credits.static.getNextCost(`upg${boostId}Credits`),
    //     boost: statBoost.value(E(1)),
    // };
    // setBasicStatUpg(newUpg);
    setBasicStatUpg(getUpgDefaults());
}

interface IStatsMenuProps {
    renderCount: number,
    statsStored: StatsStored,
    basicStatUpg: ReturnType<typeof getUpgDefaults>,
    setBasicStatUpg: (basicStatUpgCost: ReturnType<typeof getUpgDefaults>) => void,
    gameFormats: gameFormatClass,
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns A button to buy the basic stat upgrade for the specified stat
 */
function BuyUpgStat (props: IStatsMenuProps & { upgType: AreaType }) {
    const { statsStored, upgType, basicStatUpg, gameFormats } = props;
    const statAmt = statsStored[upgType];
    const creditsStored = statsStored.credits;
    const upgCost = basicStatUpg[upgType]?.cost ?? E(0);
    const statId = [null, "power", "body", "mind"].indexOf(upgType) ?? 1;
    // Convert upgType to a string, with the first letter capitalized
    const upgTypeStr = upgType.charAt(0).toUpperCase() + upgType.slice(1);
    return (
        <Button
            type="button"
            onClick={() => buyBasicStatUpg(props)}
            disabled={creditsStored.lt(upgCost)}
            style={{
                marginBottom: "5px",
            }}
        >
            {`Buy Basic ${[null, "✊", "💪", "🧠"][statId]} | ${upgTypeStr} Upgrade [Level: ${basicStatUpg[upgType].level}] (🪙 | Cost: ${gameFormats.format(upgCost)})`}
        </Button>
    )
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The stats menu component
 */
// eslint-disable-next-line react/prop-types
function StatsMenu (props: IStatsMenuProps) {
    const { renderCount, statsStored, basicStatUpg, gameFormats } = props;
    const { format, gain } = gameFormats;

    const { power: powerStored, body: bodyStored, mind: mindStored, credits: creditsStored } = statsStored;

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>Stats</Accordion.Header>
            <Accordion.Body>
                <p>{`✊ | Power: ${format(powerStored)} [x${format((power.static.boost.getBoosts("boostUpg1Credits")[0] ?? { value: () => E(1) }).value(E(1)))}] ${player.training.current === "power" ? gain(powerStored, power.static.boost.calculate()) : ""}`}</p>
                <p>{`💪 | Body: ${format(bodyStored)} [x${format((body.static.boost.getBoosts("boostUpg2Credits")[0] ?? { value: () => E(1) }).value(E(1)))}] ${player.training.current === "body" ? gain(bodyStored, body.static.boost.calculate()) : ""}`}</p>
                <p>{`🧠 | Mind: ${format(mindStored)} [x${format((mind.static.boost.getBoosts("boostUpg3Credits")[0] ?? { value: () => E(1) }).value(E(1)))}] ${player.training.current === "mind" ? gain(mindStored, mind.static.boost.calculate()) : ""}`}</p>
                <br />
                <p>{`🪙 | Credits: ${format(creditsStored)} ${gain(creditsStored, credits.static.boost.calculate())}`}</p>

                {/* <p>{`⏫ | Current Multiplier: x${format(basicStatUpg.power)}`}</p> */}
                {/* <Button
                    type="button"
                    onClick={() => buyBasicStatUpg(props)}
                    disabled={creditsStored.lt(basicStatUpgCost.credits)}
                >
                    {`Buy Basic Stat Upgrade (Cost: ${format(basicStatUpgCost.credits)})`}
                </Button> */}
                <BuyUpgStat {...props} upgType="power" />
                <br />
                <BuyUpgStat {...props} upgType="body" />
                <br />
                <BuyUpgStat {...props} upgType="mind" />
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default StatsMenu;
export { buyBasicStatUpg };