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

import PropTypes from "prop-types";

TrainingMenu.propTypes = {
    renderCount: PropTypes.number.isRequired,
    currentTrainingArea: PropTypes.string.isRequired,
    setCurrentTrainingArea: PropTypes.func.isRequired,
};
// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The training menu component
 */
function TrainingMenu ({ renderCount, currentTrainingArea, setCurrentTrainingArea }: { renderCount: number, currentTrainingArea: string, setCurrentTrainingArea: (area: string) => void }) {
    const [trainingProgressBar, setTrainingProgressBar] = useState([0, "", ""] as [number, string, string]);
    const [modalPopup, setModalPopup] = useState({
        show: false,
        title: "",
        body: "",
    });
    const resetModal = () => setModalPopup({ show: false, title: "", body: "" });

    // const [currentTrainingArea, setCurrentTrainingArea] = useState(formatTrainingArea(0));
    // /**
    //  * Renders the training areas
    //  * @returns The training areas
    //  */
    // function renderTrainingAreas () {
    //     const out = [];
    //     for (let i = 0; i < training.areas.length; i++) {
    //         // const areaElement = document.createElement("p");
    //         // areaElement.innerHTML = formatTrainingArea(i);
    //         // trainingAreasElement.appendChild(areaElement);
    //         // out.push(areaElement);
    //         out.push(<p key={`training-area-${i}`}>{formatTrainingArea(i)}</p>);
    //     }
    //     return out;
    // }

    /**
     * Renders the training area dropdown
     * @returns The training area dropdown
     */
    function renderTrainingAreaDropdown () {
        const out = [];
        for (let i = 0; i < training.areas.length; i++) {
            out.push(<Dropdown.Item key={`training-area-${i}`} onClick={() => {
                if (!move(i)) {
                    setModalPopup({
                        show: true,
                        title: "Failed to move to area",
                        body: `You are not strong enough to train in this area. (You need ${getTrainingArea(i).req.format()} power)`,
                    });
                    return;
                }
                setCurrentTrainingArea(formatTrainingArea(playerState[1]));
            }}>{formatTrainingArea(i)}</Dropdown.Item>);
        }
        return out;
    }

    /**
     * Renders the training area progress bars
     * @returns Tuple of the training area progress bars
     */
    function progressBars (): [number, string, string] {
        if (playerState[0] !== "idle") return [0, "", ""];
        // const diffBetweenAreas = getTrainingArea(playerState[1] + 1).req.sub(getTrainingArea(playerState[1]).req);
        // console.log("difA", diffBetweenAreas);
        const playerP = E.clone(power.value);
        // console.log("diffP", playerDiffBetweenAreas);
        const percent = Math.min(playerP.div(getTrainingArea(playerState[1] + 1).req).mul(100).toNumber(), 100);
        // console.log("percent", percent);

        // Time remaining
        const playerDiffBetweenAreas = getTrainingArea(playerState[1] + 1).req.sub(playerP);
        const timeRemaining = E.formats.formatTime(E.max(0, E.clone(playerDiffBetweenAreas).div(E.clone(power.static.boost.calculate()))));
        // console.log("timeRemaining", timeRemaining);
        return [percent, timeRemaining, `${E.clone(power.value).format()} / ${getTrainingArea(playerState[1] + 1).req.format()}`];
    }

    useEffect(() => {
        setTrainingProgressBar(progressBars());
        // setCurrentTrainingArea(formatTrainingArea(playerState[1]));
    }, [renderCount]);

    return (
        <>
            <Modal
                show={modalPopup.show}
                onHide={resetModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalPopup.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalPopup.body}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={resetModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Training Areas</Accordion.Header>
                <Accordion.Body>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Move to...
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {/* <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
                            {renderTrainingAreaDropdown()}
                        </Dropdown.Menu>
                    </Dropdown>
                    <p>{currentTrainingArea}</p>
                    <p>{`Progress to next area: ${trainingProgressBar[0].toFixed(2)}% (${trainingProgressBar[2]}) [${trainingProgressBar[1]} remaining]`}</p>
                    <ProgressBar
                        animated
                        id="trainingProgressBar"
                        now={trainingProgressBar[0]}
                        // label={`Progress to next area: ${trainingProgressBar[0].toFixed(2)}% (${trainingProgressBar[1]} remaining)`}
                    />
                    {/* <div id="progressBars"></div> */}
                    {/* <div id="trainingAreas">{renderTrainingAreas()}</div> */}
                </Accordion.Body>
            </Accordion.Item>
        </>
    );
}

export default TrainingMenu;