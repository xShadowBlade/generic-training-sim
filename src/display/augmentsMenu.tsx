/**
 * @file Training menu
 */

import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Dropdown from "react-bootstrap/Dropdown";
import ProgressBar from "react-bootstrap/ProgressBar";
// import { AlertList, Alert, AlertContainer } from "react-bs-notifier";
import Button from "react-bootstrap/Button";
import { E } from "emath.js";

// import { training, formatTrainingArea, getTrainingArea } from "../features/training";
import { augments, formatAugment, getAugment, changeAugment, currentAugment } from "../features/augmentation";
// import { move, playerState } from "../features/movement";
// import { power } from "../features/stats";

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The augment menu component
 */
function AugmentMent ({ renderCount }: { renderCount: number }) {
    // const [trainingProgressBar, setTrainingProgressBar] = useState([0, "", ""] as [number, string, string]);
    const [currentAugmentStr, setCurrentAugmentStr] = useState(formatAugment(0));
    /**
     * Renders the training area dropdown
     * @returns The training area dropdown
     */
    function renderAugmentDropdown () {
        const out = [];
        for (let i = 0; i < augments.length; i++) {
            out.push(<Dropdown.Item key={`augment-${i}`} onClick={() => {
                changeAugment(i);
                updateAugment();
            }}>{formatAugment(i)}</Dropdown.Item>);
        }
        return out;
    }

    // /**
    //  * Renders the training area progress bars
    //  * @returns Tuple of the training area progress bars
    //  */
    // function progressBars (): [number, string, string] {
    //     if (playerState[0] !== "idle") return [0, "", ""];
    //     // const diffBetweenAreas = getTrainingArea(playerState[1] + 1).req.sub(getTrainingArea(playerState[1]).req);
    //     // console.log("difA", diffBetweenAreas);
    //     const playerP = E.clone(power.value);
    //     // console.log("diffP", playerDiffBetweenAreas);
    //     const percent = Math.min(playerP.div(getTrainingArea(playerState[1] + 1).req).mul(100).toNumber(), 100);
    //     // console.log("percent", percent);

    //     // Time remaining
    //     const playerDiffBetweenAreas = getTrainingArea(playerState[1] + 1).req.sub(playerP);
    //     const timeRemaining = E.formats.formatTime(E.max(0, E.clone(playerDiffBetweenAreas).div(E.clone(power.static.boost.calculate()))));
    //     // console.log("timeRemaining", timeRemaining);
    //     return [percent, timeRemaining, `${E.clone(power.value).format()} / ${getTrainingArea(playerState[1] + 1).req.format()}`];
    // }

    // useEffect(() => {
    //     // setTrainingProgressBar(progressBars());
    //     setCurrentAugmentStr(formatAugment(currentAugment));
    // }, [renderCount]);

    function updateAugment () {
        setCurrentAugmentStr(formatAugment(currentAugment));
    }

    return (
        <Accordion.Item eventKey="2">
            <Accordion.Header>Augments</Accordion.Header>
            <Accordion.Body>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Augments
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {/* <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
                        {renderAugmentDropdown()}
                    </Dropdown.Menu>
                </Dropdown>
                <p>{currentAugmentStr}</p>
                {/* <p>{`Progress to next area: ${trainingProgressBar[0].toFixed(2)}% (${trainingProgressBar[2]}) [${trainingProgressBar[1]} remaining]`}</p>
                <ProgressBar
                    animated
                    id="trainingProgressBar"
                    now={trainingProgressBar[0]}
                    // label={`Progress to next area: ${trainingProgressBar[0].toFixed(2)}% (${trainingProgressBar[1]} remaining)`}
                /> */}
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default AugmentMent;