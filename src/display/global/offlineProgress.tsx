/**
 * @file This file declares the offline progress component.
 */
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { E } from "emath.js";
import { offlineProgress } from "../../features/time";

import Game from "../../game";
import { GameFormatClass } from "./format";

interface OfflineProgressProps {
    progress: ReturnType<typeof offlineProgress>
    // gameFormat: (value: E) => string,
    // gameFormatTime: (value: E) => string,
    gameFormats: GameFormatClass,
    dataState: ReturnType<typeof Game.dataManager.loadData>,
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The offline progress component
 */
function OfflineProgress (props: OfflineProgressProps) {
    const { progress, gameFormats, dataState } = props;
    const { format, time } = gameFormats;
    const [show, setShow] = useState(progress.dt.gt(0));

    const handleClose = () => setShow(false);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Offline Progress</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!dataState && <>Your data is corrupted (or you&apos;re cheating). <br /></>}
                While you were away for {time(progress.dt.div(1000))} ...
                <br />
                {progress.power.gt(0) && <>You gained {format(progress.power)} power. <br /></>}
                {progress.body.gt(0) && <>You gained {format(progress.body)} body. <br /></>}
                {progress.mind.gt(0) && <>You gained {format(progress.mind)} mind. <br /></>}
                {progress.credits.gt(0) && <>You gained {format(progress.credits)} credits.</>}

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