/**
 * @file Display components
 */
import React, { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";

import { power } from "../features/stats";
import { credits } from "../features/credits";
// import Game from "../game";

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The stats menu component
 */
function StatsMenu ({ renderCount }: { renderCount: number }) {
    useEffect(() => {
        const powerElement = document.getElementById("power") as HTMLElement;
        powerElement.innerHTML = `✊ | Power: ${power.value.format()}`;
    }, [renderCount]);

    useEffect(() => {
        const creditsElement = document.getElementById("credits") as HTMLElement;
        creditsElement.innerHTML = `🪙 | Credits: ${credits.value.format()}`;
    }, [renderCount]);

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>Stats</Accordion.Header>
            <Accordion.Body>
                <p id="power"></p>
                <p id="credits"></p>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default StatsMenu;