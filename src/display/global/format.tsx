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

const gameFormatProps = (value: ESource, props: Pick<FormatComponentProps, "settings"> & { time?: boolean }): string => {
    if (props.time) {
        // return E.formatTime(value, 2, 9, props.settings.display.format ?? "mixed_sc");
        switch (props.settings.display.timeFormat) {
        case "short":
            return E.formats.formatTime(value, 1, props.settings.display.format ?? "mixed_sc");
        case "long":
            return E.formats.formatTimeLong(value, true, 0, 9, props.settings.display.format ?? "mixed_sc");
        }
    }
    return E.format(value, 2, 9, props.settings.display.format ?? "mixed_sc");
};

const gameFormatGainProps = (value: ESource, gain: ESource, props: Pick<FormatComponentProps, "settings">): string => {
    return E.formatGain(value, gain, props.settings.display.format ?? "mixed_sc");
};

interface FormatComponentProps {
    settings: ISettings;
    setSettings: (settings: ISettings) => void;
}

interface FormatOption<T = FormatType> {
    name: string;
    value: T;
}

type FormatTimeType = "short" | "long";

const formatOptions: FormatOption[] = ([
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
] as FormatOption[]).sort((a, b) => a.name.localeCompare(b.name));

const formatTimeOptions: FormatOption<FormatTimeType>[] = ([
    {
        name: "Short (default)",
        value: "short",
    },
    {
        name: "Long",
        value: "long",
    },
] as FormatOption<FormatTimeType>[]).sort((a, b) => a.name.localeCompare(b.name));

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns Format component
 */
function FormatComponent ({ show, props }: { show: boolean, props: FormatComponentProps }) {
    const { settings, setSettings } = props;

    const formatDropdown = () => formatOptions.map((format) => {
        return <option key={format.value} value={format.value}>{format.name}</option>;
    });

    const formatTimeDropdown = () => formatTimeOptions.map((format) => {
        return <option key={format.value} value={format.value}>{format.name}</option>;
    });

    return show && <>
        <Form.Group controlId="settings-display-format">
            <Form.Label>Number Format</Form.Label>
            <Form.Select
                value={settings.display.format}
                onChange={(e) => {
                    const newSettings = { ...settings };
                    const val = (e.target as unknown as HTMLOptionElement ?? { value: "mixed_sc" }).value as FormatType;
                    newSettings.display.format = val;
                    // console.log(val);
                    setSettings(newSettings);
                }}
            >
                {formatDropdown()}
            </Form.Select>
        </Form.Group>
        <Form.Group controlId="settings-display-time-format">
            <Form.Label>Time Format</Form.Label>
            <Form.Select
                value={settings.display.timeFormat}
                onChange={(e) => {
                    const newSettings = { ...settings };
                    const val = (e.target as unknown as HTMLOptionElement ?? { value: "short" }).value as FormatTimeType;
                    newSettings.display.timeFormat = val;
                    // console.log(val);
                    setSettings(newSettings);
                }}
            >
                {formatTimeDropdown()}
            </Form.Select>
        </Form.Group>
    </>;
}

export default FormatComponent;
export { FormatComponentProps, gameFormatProps, gameFormatGainProps, formatOptions, formatTimeOptions, FormatOption, FormatTimeType };