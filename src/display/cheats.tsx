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
import { move } from "../features/movement";
import { formatTrainingArea } from "../features/training";
import { changeAugment, formatAugment } from "../features/augmentation";
import { updateTimePlayed } from "../features/time";
// import Game from "../game";
import { E } from "emath.js";

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The cheats menu component
 */
function CheatsMenu ({ renderCount, setCurrentTrainingArea, setCurrentAugmentStr }: { renderCount: number, setCurrentTrainingArea: (area: string) => void, setCurrentAugmentStr: (augment: string) => void}) {
    /** Timewarps the game */
    function timeWarp () {
        const dt = (document.getElementById("cheats-menu-dt") as HTMLInputElement ?? { value: 0 }).value;
        // dt = E(dt);
        console.log(dt);
        power.static.gain(dt);
        credits.static.gain(dt);
        updateTimePlayed(dt, false);
    }

    return (
        <Accordion.Item eventKey="3">
            <Accordion.Header>Cheats</Accordion.Header>
            <Accordion.Body>
                <div style={{
                    display: "flex",
                }}>
                    <FloatingLabel label="Timewarp Time (ms)">
                        <Form.Control
                            id="cheats-menu-dt"
                            type="text"
                            placeholder="1e3"
                            // style={{
                            //     width: "150%",
                            // }}
                        />
                    </FloatingLabel>
                    <Button onClick={timeWarp}>Timewarp</Button>
                </div>
                <div style={{
                    display: "flex",
                }}>
                    <FloatingLabel label="Area Number">
                        <Form.Control
                            id="cheats-menu-area"
                            type="text"
                            placeholder="0"
                            // style={{
                            //     width: "150%",
                            // }}
                        />
                    </FloatingLabel>
                    <Button onClick={() => {
                        const value = parseInt((document.getElementById("cheats-menu-area") as HTMLInputElement ?? { value: "0" }).value);
                        move(value, true);
                        setCurrentTrainingArea(formatTrainingArea(value));
                    }}>Move</Button>
                </div>
                <div style={{
                    display: "flex",
                }}>
                    <FloatingLabel label="Augment Number">
                        <Form.Control
                            id="cheats-menu-augment"
                            type="text"
                            placeholder="0"
                            // style={{
                            //     width: "150%",
                            // }}
                        />
                    </FloatingLabel>
                    <Button onClick={() => {
                        const value = parseInt((document.getElementById("cheats-menu-augment") as HTMLInputElement ?? { value: "0" }).value);
                        changeAugment(
                            value,
                            false,
                            true,
                            setCurrentTrainingArea,
                        );
                        setCurrentAugmentStr(formatAugment(value));
                    }}>Change Augment</Button>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default CheatsMenu;