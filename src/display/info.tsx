/**
 * @file Menu to display info about stats
 */
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { power, body, mind } from "../features/stats";
import { credits } from "../features/credits";
import { gameCurrency } from "emath.js/game";
import { gameFormatClass } from "./global/format";
import { AreaType } from "../features/movement";
import { E } from "emath.js";

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The props for the stat info component
 */
function StatInfo ({ stat, gameFormat }: InfoProps & { stat: gameCurrency<AreaType | "credits"> }) {
    const statBoosts = stat.static.boost.boostArray.sort((a, b) => a.order - b.order);
    // console.log(statBoosts);'
    const capitalStat = stat.name.charAt(0).toUpperCase() + stat.name.slice(1);
    const { format } = gameFormat;
    return (<>
        <h2>{capitalStat}</h2>
        <ul>
            <li>Base: {format(E(1))}</li>
            <li>Boosts:
                <ul>
                    {statBoosts.map(boost => (
                        <li key={boost.id}>{boost.descriptionFn(gameFormat)}</li>
                    ))}
                </ul>
            </li>
            <li>Final boost: {format(stat.static.boost.calculate())}</li>
        </ul>
    </>);
}

interface InfoProps {
    gameFormat: gameFormatClass
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The info modal
 */
function Info (props: InfoProps) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (<>
        {/* Button to open the info menu */}
        <Button
            variant="light"
            style={{
                position: "fixed",
                top: "10px",
                right: "130px",
                backgroundImage: "url(https://img.icons8.com/ios/50/info--v1.png)",
                backgroundSize: "cover",
                // background: "none",
                width: "50px",
                height: "50px",
                border: "solid 3px black",
                zIndex: 1000,
            }}
            onClick={handleShow}
        />
        {/* Modal for the info */}
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            centered
            id="infoModal"
            dialogClassName="modal-30h"
            // backdrop={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Info
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <StatInfo {...props} stat={power} />
                <hr />
                <StatInfo {...props} stat={body} />
                <hr />
                <StatInfo {...props} stat={mind} />
                <hr />
                <StatInfo {...props} stat={credits} />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default Info;
export { StatInfo, InfoProps };