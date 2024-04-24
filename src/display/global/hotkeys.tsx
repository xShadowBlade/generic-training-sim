/* eslint-disable react/prop-types */
/**
 * @file Hotkeys
 */
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { E } from "emath.js";
import { keys, KeyBinding } from "emath.js/game";

import Game, { player } from "../../game";
// import { playerState } from "../../features/movement";
import { ISettings } from "../settings";
import { moveToAreaWithCheck } from "../trainingMenu";
import { StatsMenuProps, buyBasicStatUpg } from "../statsMenu";
import { TrainingMenuProps } from "../trainingMenu";
import { GameFormatClass } from "./format";

interface IHotkey {
    name: string;
    // name: keyof typeof defaultHotkeys;
    // description?: string;
    effect?: (props: HotkeysProps) => void;
}

interface IHotkeyData {
    name: string;
    key: string;
}

const defaultHotkeys: IHotkeyData[] = [
    // {
    //     name: "Buy Upgrade",
    //     key: "z",
    // },
    // {
    //     name: "Buy Augment",
    //     key: "a",
    // },
    {
        name: "Buy Power Upgrade",
        key: "h",
    },
    {
        name: "Buy Body Upgrade",
        key: "j",
    },
    {
        name: "Buy Mind Upgrade",
        key: "k",
    },
    {
        name: "Move to Previous Area", // why would you want to go back?
        key: "x",
    },
    {
        name: "Move to Next Area",
        key: "c",
    },

    {
        name: "Move to Power Areas",
        key: "b",
    },
    {
        name: "Move to Body Areas",
        key: "n",
    },
    {
        name: "Move to Mind Areas",
        key: "m",
    },
];

const hotkeys: IHotkey[] = [
    // {
    //     name: "Buy Upgrade",
    //     // effect: (props) => {
    //     //     // console.log("buy upgrade");
    //     //     buyBasicStatUpg(props);
    //     // },
    // },
    // {
    //     name: "Buy Augment",
    //     key: "a",
    // },
    {
        name: "Buy Power Upgrade",
        effect: (props) => {
            buyBasicStatUpg({ ...props, upgType: "power" });
        },
    },
    {
        name: "Buy Body Upgrade",
        effect: (props) => {
            buyBasicStatUpg({ ...props, upgType: "body" });
        },
    },
    {
        name: "Buy Mind Upgrade",
        effect: (props) => {
            buyBasicStatUpg({ ...props, upgType: "mind" });
        },
    },
    {
        name: "Move to Previous Area", // why would you want to go back?
        effect: (props) => {
            const newArea = player.training[`${player.training.current}Area`] - 1;
            // console.log(newArea);
            moveToAreaWithCheck(player.training.current, newArea, props);
        },
    },
    {
        name: "Move to Next Area",
        effect: (props) => {
            const newArea = player.training[`${player.training.current}Area`] + 1;
            // console.log(newArea);
            moveToAreaWithCheck(player.training.current, newArea, props);
        },
    },
    {
        name: "Move to Power Areas",
        effect: (props) => {
            moveToAreaWithCheck("power", player.training.powerArea, props);
        },
    },
    {
        name: "Move to Body Areas",
        effect: (props) => {
            moveToAreaWithCheck("body", player.training.bodyArea, props);
        },
    },
    {
        name: "Move to Mind Areas",
        effect: (props) => {
            moveToAreaWithCheck("mind", player.training.mindArea, props);
        },
    },
];

interface HotkeysProps extends Pick<TrainingMenuProps, "setAlertPopup" | "setCurrentTrainingArea">, Pick<StatsMenuProps, "setBasicStatUpg" | "basicStatUpg"> {
    settings: ISettings;
    setSettings: (settings: ISettings) => void;
    // setBasicStatUpgCost: (basicStatUpgCost: { credits: E, power: E }) => void;
    gameFormats: GameFormatClass;

    // setAlertPopup: (alertPopup: IAlerts) => void;
    // setCurrentTrainingArea: (area: string) => void;
}

const getHotkey = (name: string) => {
    return hotkeys.find(hotkey => hotkey.name === name);
};

const updateHotkeys = (props: HotkeysProps) => {
    const { settings } = props;
    // console.log("Adding hotkeys");
    Game.keyManager.addKey((settings.hotkeys ?? defaultHotkeys).map(hotkey => {
        const bind: KeyBinding = {
            name: hotkey.name,
            key: hotkey.key,
            onPress: () => {
                const hotkeyToAdd = getHotkey(hotkey.name);
                if (hotkeyToAdd && hotkeyToAdd.effect) hotkeyToAdd.effect(props);
            },
        };
        // console.log(bind);
        return bind;
    }));
};

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The hotkeys component
 */
function Hotkeys ({ props }: { props: HotkeysProps }) {
    const { settings, setSettings } = props;

    useEffect(() => {
        updateHotkeys(props);
    }, [settings]);

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
                    value={(settings.hotkeys ?? defaultHotkeys)[i]?.key}
                    onChange={(e) => {
                        console.log(e.target.value);
                        const newSettings = { ...settings };
                        newSettings.hotkeys[i].key = e.target.value;
                        setSettings(newSettings);
                        // updateHotkeys(props);
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