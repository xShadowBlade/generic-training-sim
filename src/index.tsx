/**
 * @fileoverview This file is the entry point for your project.
 */

import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Accordion from "react-bootstrap/Accordion";

// TODO: Add proper loading
import Game from "./game";

import "./features/stats";
import "./features/training";
import "./features/movement";
import "./features/credits";

import StatsMenu from "./display/statsMenu";
import TrainingMenu from "./display/trainingMenu";
import CheatsMenu from "./display/cheats";

Game.init();

/**
 * @returns The main app component
 */
function App () {
    const [renderCount, setRenderCount] = useState(0);
    useEffect(() => {
        Game.eventManager.setEvent("render", "interval", 0, () => {
            setRenderCount((prevCount) => prevCount + 1);
        });

        return () => {
            Game.eventManager.removeEvent("render");
        };
    }, []);

    return (<>
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <StatsMenu renderCount={renderCount} />
            <TrainingMenu renderCount={renderCount} />
            <CheatsMenu renderCount={renderCount} />
        </Accordion>
    </>);
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);