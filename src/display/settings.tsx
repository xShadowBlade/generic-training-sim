/**
 * @file Settings
 */
import React, { useState, useEffect } from "react";
// import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";

// import { keys } from "emath.js/game";
import { E, FormatType, FormatTypeList } from "emath.js";

import Game, { gameConfig } from "../game";
import { timePlayed, timePlayedReal } from "../features/time";

import Hotkeys, { IHotkeyData, defaultHotkeys, HotkeysProps, updateHotkeys } from "./global/hotkeys";
import FormatComponent, { FormatComponentProps, FormatTimeType, GameFormatClass } from "./global/format";

const resetData = () => {
    Game.dataManager.resetData();
    localStorage.setItem(`${Game.config.name.id}-data`, "");
    gameConfig.saveOnExit = false;
    window.location.reload();
};

interface ISettings {
    gameplay: {
        offlineProgress: boolean;
        cheats: boolean;
    };
    display: {
        // animations: boolean;
        fps: number;
        // format: FormatType;
        // timeFormat: "short" | "long";
        trainingAreaFailPopup: boolean;
        augmentFailPopup: boolean;
        confirmAugment: boolean;
        disableWelcomeMessage: boolean;
        format: {
            formatType: FormatType;
            formatTimeType: FormatTimeType;
            acc: number;
            max: number;
        }
    };
    data: {
        autosave: boolean;
        saveOnExit: boolean;
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
        // format: "mixed_sc",
        // timeFormat: "short",
        trainingAreaFailPopup: true,
        augmentFailPopup: true,
        confirmAugment: true,
        disableWelcomeMessage: false,
        format: {
            formatType: "mixed_sc",
            formatTimeType: "short",
            acc: 2,
            max: 9,
        },
    },
    data: {
        autosave: true,
        saveOnExit: true,
    },
    hotkeys: defaultHotkeys,
};

interface SettingsProps extends HotkeysProps, FormatComponentProps {
    settings: ISettings;
    setSettings: (settings: ISettings) => void;
    renderCount: number;
    gameFormats: GameFormatClass;
    showWelcomeMessage: () => void;
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The settings component
 */
function Settings (props: SettingsProps) {
    const { settings, setSettings, renderCount, gameFormats, showWelcomeMessage } = props;
    const [show, setShow] = useState(false);
    const [playtime, setPlaytime] = useState({
        real: "",
        total: "",
    });

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
        gameConfig.saveOnExit = false;
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
                // format: (document.getElementById("settings-display-format") as HTMLInputElement).value as FormatType,
                // timeFormat: (document.getElementById("settings-display-time-format") as HTMLInputElement).value as FormatTimeType,
                confirmAugment: (document.getElementById("settings-data-confirmAugment") as HTMLInputElement).checked,
                trainingAreaFailPopup: (document.getElementById("settings-data-trainingAreaFailPopup") as HTMLInputElement).checked,
                augmentFailPopup: (document.getElementById("settings-data-augmentFailPopup") as HTMLInputElement).checked,
                disableWelcomeMessage: (document.getElementById("settings-display-disableWelcomeMessage") as HTMLInputElement).checked,
                format: {
                    formatType: (document.getElementById("settings-display-format") as HTMLSelectElement).value as FormatType,
                    formatTimeType: (document.getElementById("settings-display-time-format") as HTMLSelectElement).value as FormatTimeType,
                    acc: parseInt((document.getElementById("settings-display-format-acc") as HTMLInputElement).value, 10),
                    max: parseInt((document.getElementById("settings-display-format-max") as HTMLInputElement).value, 10),
                },
            },
            data: {
                autosave: (document.getElementById("settings-data-autosave") as HTMLInputElement).checked,
                saveOnExit: (document.getElementById("settings-data-saveOnExit") as HTMLInputElement).checked,
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

    // Update playtime
    useEffect(() => {
        setPlaytime({
            // real: gameFormats.time(Game.dataManager.getData("timePlayedReal").div(1000) ?? 0),
            // total: gameFormats.time(Game.dataManager.getData("timePlayed").div(1000) ?? 0),

            real: gameFormats.time(timePlayedReal.value.div(1000) ?? 0),
            total: gameFormats.time(timePlayed.value.div(1000) ?? 0),
        });
    }, [renderCount]);

    return <>
        <Button
            variant="light"
            style={{
                position: "fixed",
                top: "10px",
                right: "10px",
                backgroundImage: "url(https://img.icons8.com/plasticine/50/settings.png)",
                backgroundSize: "cover",
                // background: "none",
                width: "50px",
                height: "50px",
                border: "solid 3px black",
                zIndex: 1000,
            }}
            onClick={handleShow}
            aria-label="Open settings"
        />
        <Button onClick={handleShow}>Settings</Button>
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Settings</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div>
                    <h3>Statistics</h3>
                    <p>Time played (real): {playtime.real}</p>
                    <p>Time played (total): {playtime.total}</p>
                </div>
                <hr />
                <div>
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
                </div>
                <hr />
                <div>
                    <h3>Hotkeys</h3>
                    <Hotkeys
                        props={props}
                    />
                </div>
                <hr />
                <div>
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
                    <FormatComponent
                        props={props}
                        show={true}
                    />
                    <Form.Check
                        type="switch"
                        label="Training area fail popup"
                        id="settings-data-trainingAreaFailPopup"
                        checked={settings.display.trainingAreaFailPopup}
                        onChange={saveSettings}
                    />
                    <Form.Check
                        type="switch"
                        label="Augment fail popup"
                        id="settings-data-augmentFailPopup"
                        checked={settings.display.augmentFailPopup}
                        onChange={saveSettings}
                    />
                    <Form.Check
                        type="switch"
                        label="Confirm augment"
                        id="settings-data-confirmAugment"
                        checked={settings.display.confirmAugment}
                        onChange={saveSettings}
                    />
                    <Form.Check
                        type="switch"
                        label="Disable welcome message"
                        id="settings-display-disableWelcomeMessage"
                        checked={settings.display.disableWelcomeMessage}
                        onChange={saveSettings}
                    />
                </div>
                <hr />
                <div>
                    <h3>Data</h3>
                    <Form.Check
                        type="switch"
                        label="Autosave"
                        id="settings-data-autosave"
                        checked={settings.data.autosave}
                        onChange={saveSettings}
                    />
                    <Form.Check
                        type="switch"
                        label="Save on exit"
                        id="settings-data-saveOnExit"
                        checked={settings.data.saveOnExit}
                        onChange={saveSettings}
                    />
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
                                resetData();
                            }
                        }}
                    >Reset Data</Button>
                </div>
                <hr />
                <div>
                    <h3>Other</h3>
                    <Button
                        variant="primary"
                        onClick={showWelcomeMessage}
                    >
                        Show welcome message
                    </Button>
                    <br />
                    <Button
                        variant="danger"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to reset your settings?")) {
                                setSettings(defaultSettings);
                            }
                        }}
                    >Reset Settings</Button>
                </div>
                <hr />
                <div>
                    <h3>Credits</h3>
                    <p>Version {Game.config.name.version}</p>
                    <p>This game was made by <a href="https://github.com/xShadowBlade" target="_blank" rel="noreferrer">xShadowBlade</a></p>
                    <p>It is open source and available on <a href="https://github.com/xShadowBlade/generic-training-sim" target="_blank" rel="noreferrer">GitHub</a>.</p>
                    <p>It is licensed under the <a href="https://github.com/xShadowBlade/generic-training-sim/blob/main/LICENSE" target="_blank" rel="noreferrer">MIT License</a>.</p>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    </>;
}

export default Settings;
export { ISettings, defaultSettings, resetData };