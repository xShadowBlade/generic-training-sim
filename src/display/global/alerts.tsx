/**
 * @file Alert / notification info system using modals
 */
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface IAlerts {
    // show: boolean;
    title: string;
    body: string;
}

interface IAlertsProps {
    // alerts: IAlerts[];
    // setAlerts: (alerts: IAlerts[]) => void;
    alertPopup: IAlerts;
    setAlertPopup: (alertPopup: IAlerts) => void;
}

const defaultAlerts: IAlerts = {
    // show: false,
    title: "",
    body: "",
};

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The alerts component
 */
function Alerts (props: IAlertsProps) {
    const { alertPopup, setAlertPopup } = props;
    const [show, setShow] = useState(false);
    const resetAlertPopup = () => {
        setAlertPopup({ title: "", body: "" });
        setShow(false);
    };
    useEffect(() => {
        if (alertPopup.title !== "" || alertPopup.body !== "") {
            setShow(true);
        }
    }, [alertPopup]);
    return (
        <Modal
            show={show}
            onHide={resetAlertPopup}
        >
            <Modal.Header closeButton>
                <Modal.Title>{alertPopup.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{alertPopup.body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={resetAlertPopup}>
                        Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Alerts;
export { IAlerts, defaultAlerts };