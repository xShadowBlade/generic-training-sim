/* eslint-disable react/prop-types */
/**
 * @file Format
 */
import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
import { E, FormatType, FormatTypeList, ESource } from "emath.js";
import { formatOptions, formatTimeOptions, FormatTimeType, FormatOption, gameFormatClass } from "emath.js/presets";

import { ISettings, defaultSettings } from "../settings";

interface FormatComponentProps {
    settings: ISettings;
    setSettings: (settings: ISettings) => void;
}

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
                value={settings.display.format.formatType}
                onChange={(e) => {
                    const newSettings = { ...settings };
                    const val = (e.target as unknown as HTMLOptionElement ?? { value: "mixed_sc" }).value as FormatType;
                    settings.display.format.formatType = val;
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
                value={settings.display.format.formatTimeType}
                onChange={(e) => {
                    const newSettings = { ...settings };
                    const val = (e.target as unknown as HTMLOptionElement ?? { value: "short" }).value as FormatTimeType;
                    newSettings.display.format.formatTimeType = val;
                    // console.log(val);
                    setSettings(newSettings);
                }}
            >
                {formatTimeDropdown()}
            </Form.Select>
        </Form.Group>
        <Form.Group controlId="settings-display-format-acc">
            <Form.Label>Format accuracy (default 2)</Form.Label>
            <Form.Control
                type="number"
                min={0}
                max={15}
                step={1}
                value={settings.display.format.acc}
                onChange={(e) => {
                    const newSettings = { ...settings };
                    // newSettings.display.fps = parseInt(e.target.value ?? "0", 10) ?? 30;
                    newSettings.display.format.acc = parseInt((e.target.value ?? "2"), 10) ?? 2;
                    setSettings(newSettings);
                }}
            />
        </Form.Group>
        <Form.Group controlId="settings-display-format-max">
            <Form.Label>Format max (default 9)</Form.Label>
            <Form.Control
                type="number"
                min={0}
                max={15}
                step={1}
                value={settings.display.format.max}
                onChange={(e) => {
                    const newSettings = { ...settings };
                    // newSettings.display.fps = parseInt(e.target.value ?? "0", 10) ?? 30;
                    newSettings.display.format.max = parseInt((e.target.value ?? "9"), 10) ?? 9;
                    setSettings(newSettings);
                }}
            />
        </Form.Group>
    </>;
}

export default FormatComponent;
export { FormatComponentProps, formatOptions, formatTimeOptions, gameFormatClass };
export type { FormatOption, FormatTimeType };