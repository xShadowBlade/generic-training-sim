/**
 * @file Component for the cheats menu
 */
import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import { power } from "../features/stats";
import { credits } from "../features/credits"; // TODO: fix
// import Game from "../game";
// import { E } from "emath.js";

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The cheats menu component
 */
function CheatsMenu ({ renderCount }: { renderCount: number }) {
    /**
     * Timewarps the game
     */
    function timeWarp () {
        const dt = (document.getElementById("cheats-menu-dt") as HTMLInputElement ?? { value: 0 }).value;
        // dt = E(dt);
        console.log(dt);
        power.static.gain(dt);
        credits.static.gain(dt);
        // // @ts-expect-error - cheating
        // Game.dataManager.static.credits.currency.gain(dt);
        // // @ts-expect-error - cheating
        // Game.dataManager.static.power.currency.gain(dt);
    }

    return (
        <Accordion.Item eventKey="3">
            <Accordion.Header>Cheats</Accordion.Header>
            <Accordion.Body>
                <FloatingLabel label="Timewarp Time">
                    <Form.Control id="cheats-menu-dt" type="text" placeholder="1e3" />
                </FloatingLabel>
                <Button onClick={timeWarp}>Timewarp</Button>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default CheatsMenu;