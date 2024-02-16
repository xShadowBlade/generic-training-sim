/**
 * @file This file declares the offline progress component.
 */
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { E } from "emath.js";
import { offlineProgress } from "../../features/time";

import Game from "../../game";

interface OfflineProgressProps {
    progress: ReturnType<typeof offlineProgress>
    gameFormat: (value: E) => string,
    gameFormatTime: (value: E) => string,
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The offline progress component
 */
function OfflineProgress (props: OfflineProgressProps) {
    const { progress, gameFormat, gameFormatTime } = props;
    const [show, setShow] = useState(progress.dt.gt(0));

    const handleClose = () => setShow(false);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Offline Progress</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                While you were away for {gameFormatTime(progress.dt.div(1000))} ...
                <br /> You gained {gameFormat(progress.power)} power.
                <br /> You gained {gameFormat(progress.credits)} credits.
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