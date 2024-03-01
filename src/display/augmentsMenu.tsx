/**
 * @file Training menu
 */

import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "react-bootstrap/ProgressBar";
// import { AlertList, Alert, AlertContainer } from "react-bs-notifier";
// import Button from "react-bootstrap/Button";
import { E } from "emath.js";

// import { training, formatTrainingArea, getTrainingArea } from "../features/training";
import { powerAugment, checkAugment, changePowerAugment } from "../features/augmentation";
// import { move, playerState } from "../features/movement";
import { power } from "../features/stats";
import { ISettings } from "./settings";
import { IAlerts } from "./global/alerts";
import { gameFormatClass } from "./global/format";
import { player } from "../game";
import { getUpgDefaults } from "../features/credits";

interface IAugmentMenuProps {
    renderCount: number,
    setCurrentTrainingArea: (area: string) => void,
    currentAugmentStr: string,
    setCurrentAugmentStr: (augment: string) => void,
    setAlertPopup: (alertPopup: IAlerts) => void,
    // gameFormat: (value: E) => string,
    // gameFormatTime: (value: E) => string,
    gameFormats: gameFormatClass,
    settings: ISettings,
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The augment menu component
 */
function AugmentMenu (props: IAugmentMenuProps) {
    const { renderCount, setCurrentTrainingArea, currentAugmentStr, setCurrentAugmentStr, setAlertPopup, gameFormats, settings } = props;
    const { format, time } = gameFormats;
    const currentAugment = player.augment.current;
    const [formatAugment, getAugment] = [powerAugment.formatArea, powerAugment.getArea];
    const [progressBar, setProgressBar] = useState([0, "", ""] as [number, string, string]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentAugmentToChange, setCurrentAugmentToChange] = useState(0);
    /**
     * Renders the training area dropdown
     * @returns The training area dropdown
     */
    function renderAugmentDropdown () {
        const out = [];
        for (let i = 0; i < powerAugment.areas.length; i++) {
            out.push(<Dropdown.Item key={`augment-${i}`} onClick={() => {
                // changePowerAugment(i, true, false, setCurrentTrainingArea);
                // updateAugment();
                setCurrentAugmentToChange(i);
                if (!checkAugment(i) && settings.display.augmentFailPopup) {
                    // console.log(`You are not strong enough for this augment. (You need ${getAugment(i).req.format()} power)`);
                    setAlertPopup({
                        title: "Failed to change augment",
                        body: `You are not strong enough for this augment. (You need ${format(getAugment(i).req)} power)`,
                    });
                } else if (settings.display.confirmAugment) {
                    setShowConfirm(true);
                } else {
                    // console.log("Changing augment to " + currentAugmentToChange);
                    changePowerAugment(i, !getUpgDefaults().keepPower.keep as boolean | undefined, false, setCurrentTrainingArea);
                    updateAugment(i);
                }
            }}>{formatAugment(i, format)}</Dropdown.Item>);
        }
        return out;
    }

    const updateAugment = (augmentToChange: number) => setCurrentAugmentStr(formatAugment(augmentToChange, format));

    /**
     * Renders the training area progress bars
     * @returns Tuple of the training area progress bars
     */
    function progressBars (): [number, string, string] {
        const playerP = power.value;
        const logCurrentAugment = currentAugment !== 0 ? getAugment(currentAugment).req.log10() : E(0);
        // const logCurrentAugment = E(0); // temp fix
        // console.log(currentAugment, logCurrentAugment);
        const percentA = playerP.log10().sub(logCurrentAugment).div(getAugment(currentAugment + 1).req.log10().sub(logCurrentAugment)).mul(100);
        const percent = Math.max(Math.min(percentA.toNumber(), 100), 0);

        // Time remaining
        const playerDiffBetweenAreas = getAugment(currentAugment + 1).req.sub(playerP);
        const timeRemaining = time(E.max(0, playerDiffBetweenAreas.div(power.static.boost.calculate())));
        const out: ReturnType<typeof progressBars> = [percent, timeRemaining, `${format(power.value)} / ${format(getAugment(currentAugment + 1).req)}`];
        // console.log(out);
        return out;
    }

    useEffect(() => {
        setProgressBar(progressBars());
    }, [renderCount]);

    return (
        <Accordion.Item eventKey="2">
            <Accordion.Header>Augments</Accordion.Header>
            <Accordion.Body>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Augments
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {renderAugmentDropdown()}
                    </Dropdown.Menu>
                </Dropdown>
                <p>{currentAugmentStr}</p>
                <p>{`Progress to next augment: ${progressBar[0].toFixed(2)}% {Logramithic} (${progressBar[2]}) [${progressBar[1]} remaining]`}</p>
                <ProgressBar
                    animated
                    id="trainingProgressBar"
                    now={progressBar[0]}
                />
                <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Augmentation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to change your augment? This will reset your training progress.
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={() => {
                            // changePowerAugment(currentAugment, true, true, setCurrentTrainingArea);
                            // updateAugment();
                            if (!checkAugment(currentAugmentToChange)) {
                                setAlertPopup({
                                    title: "Failed to change augment",
                                    body: `You are not strong enough for this augment. (You need ${format(getAugment(currentAugmentToChange).req)} power)`,
                                });
                            } else {
                                changePowerAugment(currentAugmentToChange, !getUpgDefaults().keepPower.keep as boolean | undefined, false, setCurrentTrainingArea);
                                setAlertPopup({
                                    title: "Augment changed",
                                    body: `You have changed your augment to ${formatAugment(currentAugmentToChange, format)}`,
                                });
                            }
                            updateAugment(currentAugmentToChange);
                            setShowConfirm(false);
                        }}>Confirm</button>
                    </Modal.Footer>
                </Modal>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default AugmentMenu;