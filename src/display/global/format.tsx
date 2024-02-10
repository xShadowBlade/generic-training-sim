/* eslint-disable react/prop-types */
/**
 * @file Format
 */
import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
import { E, FormatType, FormatTypeList, ESource } from "emath.js";

import { ISettings } from "../settings";

const gameFormatProps = (value: ESource, props: Pick<FormatComponentProps, "settings">): string => {
    return E.format(value, 2, 9, props.settings.display.format ?? "mixed_sc");
};

const gameFormatGainProps = (value: ESource, gain: ESource, props: Pick<FormatComponentProps, "settings">): string => {
    return E.formatGain(value, gain, props.settings.display.format ?? "mixed_sc");
};

interface FormatComponentProps {
    settings: ISettings;
    setSettings: (settings: ISettings) => void;
}

interface FormatOption {
    name: string;
    value: FormatType;
}

const formatOptions: FormatOption[] = [
    {
        name: "Standard",
        value: "standard",
    },
    {
        name: "Scientific",
        value: "scientific",
    },
    {
        name: "Mixed Scientific (default)",
        value: "mixed_sc",
    },
    {
        name: "Old Scientific",
        value: "old_sc",
    },
    {
        name: "Engineering",
        value: "eng",
    },
    {
        name: "Infinity",
        value: "inf",
    },
    {
        name: "Omega",
        value: "omega",
    },
    {
        name: "Omega Short",
        value: "omega_short",
    },
    {
        name: "Elemental",
        value: "elemental",
    },
    {
        name: "Layer",
        value: "layer",
    },
];

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns Format component
 */
function FormatComponent ({ show, props }: { show: boolean, props: FormatComponentProps }) {
    const { settings, setSettings } = props;

    const formatDropdown = () => formatOptions.map((format) => {
        return <option key={format.value} value={format.value}>{format.name}</option>;
    });

    return show && <Form.Group controlId="settings-display-format">
        <Form.Label>Number Format</Form.Label>
        {/* <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {settings.display.format}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {FormatTypeList.map((format) => {
                    return <Dropdown.Item
                        key={format}
                        onClick={() => {
                            const newSettings = { ...settings };
                            newSettings.display.format = format;
                            setSettings(newSettings);
                        }}
                    >{format}</Dropdown.Item>;
                })}
            </Dropdown.Menu>
        </Dropdown> */}
        <Form.Select
            value={settings.display.format}
            onChange={(e) => {
                const newSettings = { ...settings };
                const val = (e.target as unknown as HTMLOptionElement ?? { value: "mixed_sc" }).value as FormatType;
                newSettings.display.format = val;
                console.log(val);
                setSettings(newSettings);
            }}
        >
            {formatDropdown()}
        </Form.Select>

    </Form.Group>;
}

export default FormatComponent;
export { FormatComponentProps, gameFormatProps, gameFormatGainProps };