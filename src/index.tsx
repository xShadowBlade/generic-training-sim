/**
 * @file This file is the entry point for your project.
 */
/* eslint-disable import/first */
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Accordion from "react-bootstrap/Accordion";

// TODO: Add proper loading
import "emath.js";
import "emath.js/game";

import Game from "./game";

import { power } from "./features/stats";
import { credits } from "./features/credits";
import { formatTrainingArea } from "./features/training";
import { move } from "./features/movement";
import "./features/credits";
import { changeAugment, formatAugment } from "./features/augmentation";

import { updateTimeLastPlayed, offlineProgress, IOfflineProgress } from "./features/time";

import Settings, { ISettings, defaultSettings } from "./display/settings";

Game.dataManager.setData("settings", defaultSettings);

Game.init();

window.addEventListener("beforeunload", function (e) {
    // Your code to run before the page unloads goes here
    // For example, you can save user data to a server.
    // Make sure to return a message to display to the user.
    updateTimeLastPlayed();
    Game.dataManager.saveData();
    // e.returnValue = "Are you sure you want to leave this page?";
});

Game.eventManager.setEvent("save", "interval", 30e3, () => {
    updateTimeLastPlayed();
    Game.dataManager.saveData();
    console.log("Auto save complete.");
});

Game.dataManager.loadData();

// const progress = offlineProgress();

const currentArea = Game.dataManager.getData("currentArea") ?? 0;
move(currentArea, true);
const currentAugment = Game.dataManager.getData("currentAugment") ?? 0;
changeAugment(currentAugment, false, true);

import "./css/bootstrap.min.css";

import StatsMenu from "./display/statsMenu";
import TrainingMenu from "./display/trainingMenu";
import AugmentMenu from "./display/augmentsMenu";
import CheatsMenu from "./display/cheats";
import OfflineProgress from "./display/offlineProgress";
// import Alerts, { IAlerts } from "./display/alerts";

/**
 * @returns The main app component
 */
function App () {
    const [renderCount, setRenderCount] = useState(0);
    const [powerStored, setPowerStored] = useState(power.value);
    const [creditsStored, setCreditsStored] = useState(credits.value);
    const [currentTrainingArea, setCurrentTrainingArea] = useState(formatTrainingArea(currentArea));
    const [currentAugmentStr, setCurrentAugmentStr] = useState(formatAugment(currentAugment));
    const [progress, setProgress] = useState<IOfflineProgress>();
    const [settings, setSettings] = useState<ISettings>(Game.dataManager.getData("settings") ?? defaultSettings);
    // const [alerts, setAlerts] = useState<IAlerts[]>([
    //     {
    //         id: 0,
    //         type: "info",
    //         headline: "Welcome",
    //         message: "Welcome to the game!",
    //     },
    // ]);

    // const addAlert = (alert: IAlerts) => {
    //     setAlerts([...alerts, alert]);
    // };

    // console.log(Game.dataManager.getData("settings"));
    // setSettings(Game.dataManager.getData("settings") ?? defaultSettings);

    useEffect(() => {
        Game.dataManager.setData("settings", settings);
    }, [settings]);

    useEffect(() => {
        Game.eventManager.setEvent("render", "interval", 0, () => {
            setRenderCount((prevCount) => prevCount + 1);
        });

        return () => {
            Game.eventManager.removeEvent("render");
        };
    }, []);

    useEffect(() => {
        if (settings.gameplay.offlineProgress) {
            Game.eventManager.setEvent("init", "timeout", 100, () => {
                setProgress(offlineProgress());
            });
        }
    }, []);

    useEffect(() => {
        // Update the power and credits values every frame
        setPowerStored(power.value);
        setCreditsStored(credits.value);
    }, [renderCount]);

    return (<>
        {progress && <OfflineProgress progress={progress} />}
        {/* <Alerts
            alerts={alerts}
            setAlerts={setAlerts}
        /> */}
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
            <AugmentMenu
                renderCount={renderCount}
                setCurrentTrainingArea={setCurrentTrainingArea}
                currentAugmentStr={currentAugmentStr}
                setCurrentAugmentStr={setCurrentAugmentStr}
            />
            {settings.gameplay.cheats && <CheatsMenu
                renderCount={renderCount}
                setCurrentTrainingArea={setCurrentTrainingArea}
                setCurrentAugmentStr={setCurrentAugmentStr}
            />}
        </Accordion>
        <Settings
            settings={settings}
            setSettings={setSettings}
        />
    </>);
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);