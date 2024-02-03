/**
 * @file This file is the entry point for your project.
 */
/* eslint-disable import/first */
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Accordion from "react-bootstrap/Accordion";

// TODO: Add proper loading
import Game from "./game";

import { power } from "./features/stats";
import { credits } from "./features/credits";
import { formatTrainingArea } from "./features/training";
import "./features/movement";
import "./features/credits";
import "./features/augmentation";

Game.init();

import "./css/bootstrap.min.css";

import StatsMenu from "./display/statsMenu";
import TrainingMenu from "./display/trainingMenu";
import AugmentMent from "./display/augmentsMenu";
import CheatsMenu from "./display/cheats";

/**
 * @returns The main app component
 */
function App () {
    const [renderCount, setRenderCount] = useState(0);
    const [powerStored, setPowerStored] = useState(power.value);
    const [creditsStored, setCreditsStored] = useState(credits.value);
    const [currentTrainingArea, setCurrentTrainingArea] = useState(formatTrainingArea(0));

    useEffect(() => {
        Game.eventManager.setEvent("render", "interval", 0, () => {
            setRenderCount((prevCount) => prevCount + 1);
        });

        return () => {
            Game.eventManager.removeEvent("render");
        };
    }, []);

    useEffect(() => {
        // Update the power and credits values every frame
        setPowerStored(power.value);
        setCreditsStored(credits.value);
    }, [renderCount]);

    return (<>
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <StatsMenu
                renderCount={renderCount}
                powerStored={powerStored}
                creditsStored={creditsStored}
            />
            <TrainingMenu
                renderCount={renderCount}
                currentTrainingArea={currentTrainingArea}
                setCurrentTrainingArea={setCurrentTrainingArea}
            />
            <AugmentMent
                renderCount={renderCount}
                setCurrentTrainingArea={setCurrentTrainingArea}
            />
            <CheatsMenu renderCount={renderCount} />
        </Accordion>
    </>);
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);