/**
 * @file This file declares the offline progress component.
 */
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { E } from "emath.js";
import { offlineProgress } from "../features/time";

import Game from "../game";

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The offline progress component
 */
function OfflineProgress ({ progress }: { progress: ReturnType<typeof offlineProgress> }) {
    const [show, setShow] = useState(progress.dt.gt(0));

    const handleClose = () => setShow(false);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Offline Progress</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                While you were away for {E.formats.formatTime(progress.dt.div(1000))} ...
                <br /> You gained {progress.power.format()} power.
                <br /> You gained {progress.credits.format()} credits.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default OfflineProgress;