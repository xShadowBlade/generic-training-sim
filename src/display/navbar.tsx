/**
 * @file The navbar component, gui in the top right.
 */
import React, { useState } from "react";
// import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import Tutorial from "./tutorial";
import Info, { InfoProps } from "./info";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NavbarProps extends InfoProps {}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The navbar component
 */
function Navbar (props: NavbarProps) {
    return (<Container style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 999,
    }}>
        {/* Top right gui */}
        <Tutorial
            // settings={settings}
            // setSettings={setSettings}
        />
        <Info {...props} />
    </Container>);
}

export default Navbar;