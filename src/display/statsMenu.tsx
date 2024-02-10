/**
 * @file Display components
 */
import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

import { power } from "../features/stats";
import { credits } from "../features/credits";
// import Game from "../game";
import { E } from "emath.js";

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
    powerStored: E,
    creditsStored: E,
    basicStatUpgCost: { credits: E, power: E },
    setBasicStatUpgCost: (basicStatUpgCost: { credits: E, power: E }) => void,
    gameFormat: (x: E) => string,
    gameFormatGain: (x: E, gain: E) => string,
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The stats menu component
 */
// eslint-disable-next-line react/prop-types
function StatsMenu (props: IStatsMenuProps) {
    const { renderCount, powerStored, creditsStored, basicStatUpgCost, gameFormat, gameFormatGain } = props;

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>Stats</Accordion.Header>
            <Accordion.Body>
                <p>{`✊ | Power: ${gameFormat(powerStored)} ${gameFormatGain(powerStored, power.static.boost.calculate())}`}</p>
                <p>{`🪙 | Credits: ${gameFormat(creditsStored)} ${gameFormatGain(creditsStored, credits.static.boost.calculate())}`}</p>

                <p>{`⏫ | Current Multiplier: x${gameFormat(basicStatUpgCost.power)}`}</p>
                <Button
                    type="button"
                    onClick={() => buyBasicStatUpg(props)}
                    disabled={creditsStored.lt(basicStatUpgCost.credits)}
                >
                    {`Buy Basic Stat Upgrade (Cost: ${gameFormat(basicStatUpgCost.credits)})`}
                </Button>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default StatsMenu;
export { buyBasicStatUpg };