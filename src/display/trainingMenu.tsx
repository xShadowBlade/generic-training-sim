/**
 * @file Training menu
 */

import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Dropdown from "react-bootstrap/Dropdown";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { E } from "emath.js";

import { training, formatTrainingArea, getTrainingArea } from "../features/training";
import { move, playerState } from "../features/movement";
import { power } from "../features/stats";

import { IAlerts } from "./global/alerts";

interface TrainingMenuProps {
    renderCount: number,
    currentTrainingArea: string,
    setCurrentTrainingArea: (area: string) => void,
    // alertPopup: IAlerts,
    setAlertPopup: (alertPopup: IAlerts) => void,
    gameFormat: (value: E) => string,
}

/**
 * Moves to the specified training area
 * @param area - The training area to move to
 * @param props - The training menu props
 */
function moveToAreaWithCheck (area: number, { setAlertPopup, setCurrentTrainingArea, gameFormat }: Pick<TrainingMenuProps, "setAlertPopup" | "setCurrentTrainingArea" | "gameFormat">) {
    if (area < 0) return;
    if (!move(area)) {
        setAlertPopup({
            title: "Failed to move to area",
            body: `You are not strong enough to train in this area. (You need ${gameFormat(getTrainingArea(area).req)} power)`,
        });
        return;
    }
    setCurrentTrainingArea(formatTrainingArea(playerState[1], gameFormat));
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The training menu component
 */
function TrainingMenu (props: TrainingMenuProps) {
    const { renderCount, currentTrainingArea, gameFormat } = props;

    const [trainingProgressBar, setTrainingProgressBar] = useState([0, "", ""] as [number, string, string]);

    const renderTrainingAreaDropdown = () => {
        const out = [];
        for (let i = 0; i < training.areas.length; i++) {
            out.push(<Dropdown.Item key={`training-area-${i}`} onClick={() => moveToAreaWithCheck(i, props)}>{formatTrainingArea(i, gameFormat)}</Dropdown.Item>);
        }
        return out;
    };

    /**
     * Renders the training area progress bars
     * @returns Tuple of the training area progress bars
     */
    function progressBars (): [number, string, string] {
        if (playerState[0] !== "idle") return [0, "", ""];
        const playerP = power.value;
        const percent = Math.min(playerP.div(getTrainingArea(playerState[1] + 1).req).mul(100).toNumber(), 100);

        // Time remaining
        const playerDiffBetweenAreas = getTrainingArea(playerState[1] + 1).req.sub(playerP);
        const timeRemaining = E.formats.formatTime(E.max(0, playerDiffBetweenAreas.div(power.static.boost.calculate())));
        return [percent, timeRemaining, `${gameFormat(power.value)} / ${gameFormat(getTrainingArea(playerState[1] + 1).req)}`];
    }

    useEffect(() => {
        setTrainingProgressBar(progressBars());
    }, [renderCount]);

    return (
        <Accordion.Item eventKey="1">
            <Accordion.Header>Training Areas</Accordion.Header>
            <Accordion.Body>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Move to...
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {renderTrainingAreaDropdown()}
                    </Dropdown.Menu>
                </Dropdown>
                <p>{currentTrainingArea}</p>
                <p>{`Progress to next area: ${trainingProgressBar[0].toFixed(2)}% (${trainingProgressBar[2]}) [${trainingProgressBar[1]} remaining]`}</p>
                <ProgressBar
                    animated
                    id="trainingProgressBar"
                    now={trainingProgressBar[0]}
                />
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default TrainingMenu;
export { TrainingMenuProps, moveToAreaWithCheck };