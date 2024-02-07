/**
 * @file Settings
 */
import React, { useState, useEffect } from "react";
// import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";

import Game from "../game";

interface ISettings {
    gameplay: {
        offlineProgress: boolean;
        cheats: boolean;
    };
    display: {
        animations: boolean;
    };
}

const defaultSettings: ISettings = {
    gameplay: {
        offlineProgress: true,
        cheats: false,
    },
    display: {
        animations: true,
    },
};

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The settings component
 */
function Settings ({ settings, setSettings }: { settings: ISettings, setSettings: (settings: ISettings) => void}) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    /** Saves settings */
    function saveSettings () {
        const newSettings: ISettings = {
            gameplay: {
                offlineProgress: (document.getElementById("settings-gameplay-offlineProgress") as HTMLInputElement).checked,
                cheats: (document.getElementById("settings-gameplay-cheats") as HTMLInputElement).checked,
            },
            display: {
                animations: (document.getElementById("settings-display-animations") as HTMLInputElement).checked,
            },
        };
        setSettings(newSettings);
    }

    return <>
        <Button onClick={handleShow}>Settings</Button>
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Settings (bugged)</Offcanvas.Title>
                <hr />
            </Offcanvas.Header>
            <Offcanvas.Body>
                <h3>Gameplay</h3>
                <Form.Check
                    type="switch"
                    label="Offline Progress"
                    id="settings-gameplay-offlineProgress"
                    checked={settings.gameplay.offlineProgress}
                    onChange={saveSettings}
                />
                <Form.Check
                    type="switch"
                    label="Cheats"
                    id="settings-gameplay-cheats"
                    checked={settings.gameplay.cheats}
                    onChange={saveSettings}
                />
                <br />
                <h3>Display</h3>
                <Form.Check
                    type="switch"
                    label="Animations"
                    id="settings-display-animations"
                    checked={settings.display.animations}
                    onChange={saveSettings}
                />
                <br />
                <h3>Other</h3>
                <Button
                    variant="danger"
                    onClick={() => {
                        if (window.confirm("Are you sure you want to reset your data?")) {
                            Game.dataManager.resetData(true);
                        }
                    }}
                >Reset Progress</Button>
                <hr />
                {/* <Button
                    variant="primary"
                    onClick={saveSettings}
                >
                    Save
                </Button> */}
                <h3>Credits</h3>
                <p>Version 0.2.0</p>
                <p>This game was made by <a href="https://github.com/xShadowBlade">xShadowBlade</a></p>
                <p>It is open source and available on <a href="https://github.com/xShadowBlade/generic-training-sim">GitHub</a>.</p>
                <p>It is licensed under the <a href="https://github.com/xShadowBlade/generic-training-sim/blob/main/LICENSE">MIT License</a>.</p>

            </Offcanvas.Body>
        </Offcanvas>
    </>;
}

export default Settings;
export { ISettings, defaultSettings };