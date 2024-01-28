/**
 * @fileoverview This file is the entry point for your project.
 */

import React from "react";
import { createRoot } from "react-dom/client";

// TODO: Add proper loading
import Game from "./game";

import "./features/stats";
import "./features/upgrades";
import "./features/movement";
import "./features/credits";

import Display from "./display/display";

Game.init();

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<>
    {/* <Display /> */}
    {/* TODO: idk how to do display for react lol */}
    <p id="power"></p>
    <p id="credits"></p>
</>);