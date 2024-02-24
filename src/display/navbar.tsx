/**
 * @file The navbar component, gui in the top right.
 */
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import Tutorial from "./tutorial";

/**
 * @returns The navbar component
 */
function Navbar () {
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
    </Container>);
}

export default Navbar;