/**
 * @file Training menu
 */

import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
// import ProgressBar from "react-bootstrap/ProgressBar";
// import { AlertList, Alert, AlertContainer } from "react-bs-notifier";
import Button from "react-bootstrap/Button";
// import { E } from "emath.js";

// import { training, formatTrainingArea, getTrainingArea } from "../features/training";
import { augments, formatAugment, changeAugment, currentAugment, checkAugment, getAugment } from "../features/augmentation";
// import { move, playerState } from "../features/movement";
// import { power } from "../features/stats";

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The augment menu component
 */
function AugmentMenu (
    { renderCount, setCurrentTrainingArea, currentAugmentStr, setCurrentAugmentStr }:
    { renderCount: number, setCurrentTrainingArea: (area: string) => void, currentAugmentStr: string, setCurrentAugmentStr: (augment: string) => void},
) {
    // const [trainingProgressBar, setTrainingProgressBar] = useState([0, "", ""] as [number, string, string]);
    // const [currentAugmentStr, setCurrentAugmentStr] = useState(formatAugment(0));
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentAugmentToChange, setCurrentAugmentToChange] = useState(0);
    const [modalPopup, setModalPopup] = useState({
        show: false,
        title: "",
        body: "",
    });
    const resetModal = () => setModalPopup({ show: false, title: "", body: "" });
    /**
     * Renders the training area dropdown
     * @returns The training area dropdown
     */
    function renderAugmentDropdown () {
        const out = [];
        for (let i = 0; i < augments.length; i++) {
            out.push(<Dropdown.Item key={`augment-${i}`} onClick={() => {
                // changeAugment(i, true, false, setCurrentTrainingArea);
                // updateAugment();
                setCurrentAugmentToChange(i);
                if (!checkAugment(i)) {
                    // console.log(`You are not strong enough for this augment. (You need ${getAugment(i).req.format()} power)`);
                    setModalPopup({
                        show: true,
                        title: "Failed to change augment",
                        body: `You are not strong enough for this augment. (You need ${getAugment(i).req.format()} power)`,
                    });
                } else {
                    setShowConfirm(true);
                }
            }}>{formatAugment(i)}</Dropdown.Item>);
        }
        return out;
    }

    /**
     * Updates the augment string
     */
    function updateAugment () {
        setCurrentAugmentStr(formatAugment(currentAugment));
    }

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
                                // changeAugment(currentAugment, true, true, setCurrentTrainingArea);
                                // updateAugment();
                                if (!checkAugment(currentAugmentToChange)) {
                                    setModalPopup({
                                        show: true,
                                        title: "Failed to change augment",
                                        body: `You are not strong enough for this augment. (You need ${getAugment(currentAugmentToChange).req.format()} power)`,
                                    });
                                } else {
                                    changeAugment(currentAugmentToChange, true, false, setCurrentTrainingArea);
                                    setModalPopup({
                                        show: true,
                                        title: "Augment changed",
                                        body: `You have changed your augment to ${formatAugment(currentAugmentToChange)}`,
                                    });
                                }
                                updateAugment();
                                setShowConfirm(false);
                            }}>Confirm</button>
                        </Modal.Footer>
                    </Modal>
                </Accordion.Body>
            </Accordion.Item>
        </>
    );
}

export default AugmentMenu;