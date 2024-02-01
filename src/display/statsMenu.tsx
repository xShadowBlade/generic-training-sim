/**
 * @file Display components
 */
import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";

import { power } from "../features/stats";
import { credits } from "../features/credits";
// import Game from "../game";
import { E } from "emath.js";

StatsMenu.propTypes = {
    renderCount: PropTypes.number.isRequired,
};
// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The stats menu component
 */
function StatsMenu ({ renderCount }: { renderCount: number }) {
    const [powerStored, setPowerStored] = useState(power.value);
    const [creditsStored, setCreditsStored] = useState(credits.value);

    // const [creditsBasicStatUpg, setcreditsBasicStatUpg] = useState(credits.static.calculateUpgrade("upg1Credits"));
    const [creditsBasicStatUpgCost, setCreditsBasicStatUpgCost] = useState(credits.static.getNextCost("upg1Credits"));
    const [powerMultiplier, setpowerMultiplier] = useState(power.static.boost.calculate());

    useEffect(() => {
        // Update the power and credits values every frame
        setPowerStored(power.value);
        setCreditsStored(credits.value);
    }, [renderCount]);

    /**
     * Buys and renders the basic stat upgrade
     */
    function buyBasicStatUpg () {
        console.log("Buying basic stat upgrade");
        credits.static.buyUpgrade("upg1Credits");
        setCreditsBasicStatUpgCost(credits.static.getNextCost("upg1Credits"));
        const powerBoost = power.static.boost.getBoosts("boostUpg1Credits")[0];
        setpowerMultiplier(powerBoost.value(E(1)));
    }

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>Stats</Accordion.Header>
            <Accordion.Body>
                <p>{`✊ | Power: ${powerStored.format()}`}</p>
                <p>{`🪙 | Credits: ${creditsStored.format()}`}</p>

                <p>{`⏫ | Current Multiplier (x${powerMultiplier.format()})`}</p>
                <Button
                    type="button"
                    onClick={buyBasicStatUpg}
                    // disabled={creditsStored.lt(creditsBasicStatUpgCost)}
                >
                    {`Buy Basic Stat Upgrade (Cost: ${creditsBasicStatUpgCost.format()})`}
                </Button>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default StatsMenu;