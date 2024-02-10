/**
 * @file Settings
 */
import React, { useState, useEffect } from "react";
// import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";

import { keys } from "emath.js/game";

import Game from "../game";

import Hotkeys, { IHotkeyData, defaultHotkeys, HotkeysProps, updateHotkeys } from "./hotkeys";

interface ISettings {
    gameplay: {
        offlineProgress: boolean;
        cheats: boolean;
    };
    display: {
        // animations: boolean;
        fps: number;
    };
    hotkeys: IHotkeyData[];
}

const defaultSettings: ISettings = {
    gameplay: {
        offlineProgress: true,
        cheats: false,
    },
    display: {
        // animations: true,
        fps: 30,
    },
    hotkeys: defaultHotkeys,
};

interface SettingsProps extends HotkeysProps {
    settings: ISettings;
    setSettings: (settings: ISettings) => void;
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The settings component
 */
function Settings (props: SettingsProps) {
    const { settings, setSettings } = props;
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const importData = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputElement = e.target as HTMLInputElement;
        if (!inputElement.files || inputElement.files.length === 0) return;
        // Convert the file to a string
        const fileToString = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result as string;
                    resolve(result);
                };
                reader.onerror = (event) => {
                    reject(event.target?.error);
                };
                reader.readAsText(file);
            });
        };
        const dataString = await fileToString(inputElement.files[0]);
        Game.dataManager.loadData(dataString);
        Game.dataManager.saveData(dataString);
        window.location.reload();
    };

    /** Saves settings */
    function saveSettings () {
        const newSettings: ISettings = {
            gameplay: {
                offlineProgress: (document.getElementById("settings-gameplay-offlineProgress") as HTMLInputElement).checked,
                cheats: (document.getElementById("settings-gameplay-cheats") as HTMLInputElement).checked,
            },
            display: {
                // animations: (document.getElementById("settings-display-animations") as HTMLInputElement).checked,
                fps: parseInt((document.getElementById("settings-display-fps") as HTMLInputElement).value, 10),
            },
            hotkeys: settings.hotkeys,
        };
        setSettings(newSettings);
    }

    // Change the FPS when it changes
    useEffect(() => {
        Game.changeFps(settings.display.fps);
    }, [settings.display.fps]);

    // Change the hotkeys when they change
    useEffect(() => {
        updateHotkeys(props);
    }, [settings.hotkeys]);

    return <>
        <Button onClick={handleShow}>Settings</Button>
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Settings</Offcanvas.Title>
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
                <h3>Hotkeys</h3>
                <Hotkeys
                    props={props}
                />
                <br />
                <h3>Display</h3>
                <Form.Group controlId="settings-display-fps">
                    <Form.Label>FPS (set to 0 for max, anything above 60 is not supported yet)</Form.Label>
                    <Form.Control
                        type="number"
                        min={0}
                        max={60}
                        step={1}
                        value={settings.display.fps}
                        onChange={(e) => {
                            const newSettings = { ...settings };
                            newSettings.display.fps = parseInt(e.target.value ?? "0", 10) ?? 30;
                            setSettings(newSettings);
                        }}
                    />
                </Form.Group>
                {/* <Form.Check
                    type="switch"
                    label="Animations"
                    id="settings-display-animations"
                    checked={settings.display.animations}
                    onChange={saveSettings}
                /> */}
                {/* <br /> */}
                <h3>Data</h3>
                <Button
                    variant="primary"
                    onClick={() => {
                        Game.dataManager.saveData();
                    }}
                >Save Data</Button>
                <br />
                <Button
                    variant="primary"
                    onClick={() => {
                        Game.dataManager.exportData();
                    }}
                >Export / Download Data</Button>
                <br />
                <Form.Group controlId="settings-importData">
                    <Form.Label>Import / Upload Data</Form.Label>
                    {/* <Form.Control
                        type="text"
                        placeholder="Paste your data here"
                        // onChange={async (e) => importData(e as React.ChangeEvent<HTMLInputElement>)}
                    />
                    <Button
                        onClick={async () => importData(document.getElementById("settings-importData") as unknown as React.ChangeEvent<HTMLInputElement>)}
                    >Import (text)</Button> */}
                    <Form.Control
                        type="file"
                        onChange={async (e) => importData(e as React.ChangeEvent<HTMLInputElement>)}
                    />
                </Form.Group>
                <Button
                    variant="danger"
                    onClick={() => {
                        if (window.confirm("Are you sure you want to reset your data?")) {
                            Game.dataManager.resetData(true);
                        }
                    }}
                >Reset Data</Button>
                <hr />
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