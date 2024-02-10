/**
 * @file This file is the entry point for your project.
 */
/* eslint-disable import/first */
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Accordion from "react-bootstrap/Accordion";

// TODO: Add proper loading
import { E, ESource } from "emath.js";
import "emath.js/game";

import Game from "./game";

import { power } from "./features/stats";
import { credits } from "./features/credits";
import { formatTrainingArea } from "./features/training";
import { move, playerState } from "./features/movement";
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
import OfflineProgress from "./display/global/offlineProgress";
import Alerts, { IAlerts, defaultAlerts } from "./display/global/alerts";
import { gameFormatProps, gameFormatGainProps } from "./display/global/format";
// import Hotkeys from "./display/hotkeys";

/**
 * @returns The main app component
 */
function App () {
    // Misc / Global
    const [renderCount, setRenderCount] = useState(0);
    const [progress, setProgress] = useState<IOfflineProgress>();
    const [settings, setSettings] = useState<ISettings>(Game.dataManager.getData("settings") ?? defaultSettings);
    const [alertPopup, setAlertPopup] = useState(defaultAlerts);

    const gameFormat = (x: ESource) => gameFormatProps(x, { settings });
    const gameFormatGain = (x: ESource, gain: ESource) => gameFormatGainProps(x, gain, { settings });

    // Stats
    const [powerStored, setPowerStored] = useState(power.value);
    const [creditsStored, setCreditsStored] = useState(credits.value);

    // Training
    const [currentTrainingArea, setCurrentTrainingArea] = useState(formatTrainingArea(currentArea, gameFormat));

    // Augmentation
    const [currentAugmentStr, setCurrentAugmentStr] = useState(formatAugment(currentAugment, gameFormat));

    // Basic stat upgrade
    const [basicStatUpgCost, setBasicStatUpgCost] = useState({
        credits: credits.static.getNextCost("upg1Credits"),
        power: power.static.boost.getBoosts("boostUpg1Credits")[0].value(E(1)),
    });

    // Update the settings when they change
    useEffect(() => {
        Game.dataManager.setData("settings", settings);
    }, [settings]);

    // Rerender the game when the format changes
    useEffect(() => {
        setCurrentTrainingArea(formatTrainingArea(playerState[1], gameFormat));
        setCurrentAugmentStr(formatAugment(currentAugment, gameFormat));
    }, [settings.display.format]);

    // Run the render event every frame
    useEffect(() => {
        Game.eventManager.setEvent("render", "interval", 0, () => {
            setRenderCount((prevCount) => prevCount + 1);
        });

        return () => {
            Game.eventManager.removeEvent("render");
        };
    }, []);

    // Offline progress
    useEffect(() => {
        if (settings.gameplay.offlineProgress) {
            Game.eventManager.setEvent("init", "timeout", 100, () => {
                setProgress(offlineProgress());
            });
        }
    }, []);

    // Update the power and credits values every frame
    useEffect(() => {
        // Update the power and credits values every frame
        setPowerStored(power.value);
        setCreditsStored(credits.value);
    }, [renderCount]);

    return (<>
        {progress && <OfflineProgress
            progress={progress}
            gameFormat={gameFormat}
        />}
        <Alerts
            alertPopup={alertPopup}
            setAlertPopup={setAlertPopup}
        />
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <StatsMenu
                renderCount={renderCount}
                gameFormat={gameFormat}
                gameFormatGain={gameFormatGain}
                powerStored={powerStored}
                creditsStored={creditsStored}
                basicStatUpgCost={basicStatUpgCost}
                setBasicStatUpgCost={setBasicStatUpgCost}
            />
            <TrainingMenu
                renderCount={renderCount}
                currentTrainingArea={currentTrainingArea}
                setCurrentTrainingArea={setCurrentTrainingArea}
                setAlertPopup={setAlertPopup}
                gameFormat={gameFormat}
            />
            <AugmentMenu
                renderCount={renderCount}
                setCurrentTrainingArea={setCurrentTrainingArea}
                currentAugmentStr={currentAugmentStr}
                setCurrentAugmentStr={setCurrentAugmentStr}
                setAlertPopup={setAlertPopup}
                gameFormat={gameFormat}
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
            setBasicStatUpgCost={setBasicStatUpgCost}
            setAlertPopup={setAlertPopup}
            setCurrentTrainingArea={setCurrentTrainingArea}
            gameFormat={gameFormat}
        />
    </>);
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);