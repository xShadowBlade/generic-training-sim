/**
 * @file Display components
 */
import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

import { power, mind, body, StatsStored } from "../features/stats";
import { credits } from "../features/credits";
import { player } from "../game";
import { E } from "emath.js";
import { gameFormatClass } from "./global/format";

/**
 * Buys and renders the basic stat upgrade  
 * @param setBasicStatUpgCost - The function to set the basic stat upgrade cost
 */
function buyBasicStatUpg({ setBasicStatUpgCost }: Pick<IStatsMenuProps, "setBasicStatUpgCost">) {
    // Function implementation
    console.log("Buying basic stat upgrade");
    credits.static.buyUpgrade("upg1Credits");
    const powerBoost = power.static.boost.getBoosts("boostUpg1Credits")[0];
    setBasicStatUpgCost({
        credits: credits.static.getNextCost("upg1Credits"),
        power: powerBoost.value(E(1)),
    });
}

interface IStatsMenuProps {
    renderCount: number,
    // powerStored: E,
    // creditsStored: E,
    statsStored: StatsStored,
    basicStatUpgCost: { credits: E, power: E },
    setBasicStatUpgCost: (basicStatUpgCost: { credits: E, power: E }) => void,
    // gameFormat: (x: E) => string,
    // gameFormatGain: (x: E, gain: E) => string,
    gameFormats: gameFormatClass,
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The stats menu component
 */
// eslint-disable-next-line react/prop-types
function StatsMenu (props: IStatsMenuProps) {
    const { renderCount, statsStored, basicStatUpgCost, gameFormats } = props;
    const { format, gain } = gameFormats;

    const { power: powerStored, body: bodyStored, mind: mindStored, credits: creditsStored } = statsStored;

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>Stats</Accordion.Header>
            <Accordion.Body>
                <p>{`✊ | Power: ${format(powerStored)} [x${format((power.static.boost.getBoosts("boostUpg1Credits")[0] ?? { value: () => E(1) }).value(E(1)))}] ${player.training.type === "power" ? gain(powerStored, power.static.boost.calculate()) : ""}`}</p>
                <p>{`💪 | Body: ${format(bodyStored)} [x${format((body.static.boost.getBoosts("boostUpg2Credits")[0] ?? { value: () => E(1) }).value(E(1)))}] ${player.training.type === "body" ? gain(bodyStored, body.static.boost.calculate()) : ""}`}</p>
                <p>{`🧠 | Mind: ${format(mindStored)} [x${format((mind.static.boost.getBoosts("boostUpg3Credits")[0] ?? { value: () => E(1) }).value(E(1)))}] ${player.training.type === "mind" ? gain(mindStored, mind.static.boost.calculate()) : ""}`}</p>
                <br />
                <p>{`🪙 | Credits: ${format(creditsStored)} ${gain(creditsStored, credits.static.boost.calculate())}`}</p>

                <p>{`⏫ | Current Multiplier: x${format(basicStatUpgCost.power)}`}</p>
                <Button
                    type="button"
                    onClick={() => buyBasicStatUpg(props)}
                    disabled={creditsStored.lt(basicStatUpgCost.credits)}
                >
                    {`Buy Basic Stat Upgrade (Cost: ${format(basicStatUpgCost.credits)})`}
                </Button>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default StatsMenu;
export { buyBasicStatUpg };