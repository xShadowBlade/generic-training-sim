/* eslint-disable react/prop-types */
/**
 * @file Hotkeys
 */
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { E } from "emath.js";
import { keys, KeyBinding } from "emath.js/game";

import Game from "../game";
import { playerState } from "../features/movement";
// import { changeAugment } from "../features/augmentation";
import { ISettings } from "./settings";
// import { credits } from "features/credits";
// import { power } from "features/stats";
import { moveToAreaWithCheck } from "./trainingMenu";

import { buyBasicStatUpg } from "./statsMenu";
import { TrainingMenuProps } from "./trainingMenu";

interface IHotkey {
    name: string;
    // description?: string;
    effect?: (props: HotkeysProps) => void;
}

interface IHotkeyData {
    name: string;
    key: string;
}

const defaultHotkeys: IHotkeyData[] = [
    {
        name: "Buy Upgrade",
        key: "u",
    },
    // {
    //     name: "Buy Augment",
    //     key: "a",
    // },
    {
        name: "Move to Next Area",
        key: "n",
    },
    {
        name: "Move to Previous Area", // why would you want to go back?
        key: "p",
    },
];

const hotkeys: IHotkey[] = [
    {
        name: "Buy Upgrade",
        effect: (props) => {
            // console.log("buy upgrade");
            buyBasicStatUpg(props);
        },
    },
    // {
    //     name: "Buy Augment",
    //     key: "a",
    // },
    {
        name: "Move to Next Area",
        effect: (props) => {
            const newArea = playerState[1] + 1;
            // console.log(newArea);
            moveToAreaWithCheck(newArea, props);
        },
    },
    {
        name: "Move to Previous Area", // why would you want to go back?
        effect: (props) => {
            const newArea = playerState[1] - 1;
            // console.log(newArea);
            moveToAreaWithCheck(newArea, props);
        },
    },
];

interface HotkeysProps extends Pick<TrainingMenuProps, "setAlertPopup" | "setCurrentTrainingArea"> {
    settings: ISettings;
    setSettings: (settings: ISettings) => void;
    setBasicStatUpgCost: (basicStatUpgCost: { credits: E, power: E }) => void;

    // setAlertPopup: (alertPopup: IAlerts) => void;
    // setCurrentTrainingArea: (area: string) => void;
}

const getHotkey = (name: string) => {
    return hotkeys.find(hotkey => hotkey.name === name);
};

const updateHotkeys = (props: HotkeysProps) => {
    const { settings } = props;
    console.log("Adding hotkeys");
    Game.keyManager.addKey(settings.hotkeys.map(hotkey => {
        const bind: KeyBinding = {
            name: hotkey.name,
            key: hotkey.key,
            onPress: () => {
                const hotkeyToAdd = getHotkey(hotkey.name);
                if (hotkeyToAdd && hotkeyToAdd.effect) hotkeyToAdd.effect(props);
            },
        };
        console.log(bind);
        return bind;
    }));
};

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The hotkeys component
 */
function Hotkeys ({ props }: { props: HotkeysProps }) {
    const { settings, setSettings } = props;

    const renderHotkeys = () => {
        const out = [];

        const keyDropdown = (() => {
            return keys.map((key) => {
                return <option key={key}>
                    {key}
                </option>;
            });
        })();

        for (let i = 0; i < hotkeys.length; i++) {
            out.push(<Form.Group key={`settings-hotkey-${i}`} controlId={`settings-hotkey-${i}`}>
                <Form.Label>{hotkeys[i].name}</Form.Label>
                <Form.Select
                    value={settings.hotkeys[i].key}
                    onChange={(e) => {
                        console.log(e.target.value);
                        const newSettings = { ...settings };
                        newSettings.hotkeys[i].key = e.target.value;
                        setSettings(newSettings);
                        updateHotkeys(props);
                    }}
                >
                    {keyDropdown}
                </Form.Select>
            </Form.Group>);
        }
        return out;
    };

    return <>
        {renderHotkeys()}
    </>;
}

export default Hotkeys;
export { IHotkey, IHotkeyData, HotkeysProps, hotkeys, defaultHotkeys, updateHotkeys, getHotkey };