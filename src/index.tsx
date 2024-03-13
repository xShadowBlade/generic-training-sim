/**
 * @file This file is the entry point for your project.
 */
/* eslint-disable import/first */
// import "reflect-metadata";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Accordion from "react-bootstrap/Accordion";

// TODO: Add proper loading
// import { E, ESource } from "emath.js";
import "emath.js";
import "emath.js/game";
import "emath.js/presets";
import type { FormatType } from "emath.js";
import type { FormatTimeType } from "emath.js/presets";

import Game, { gameConfig, player } from "./game";

import { power, mind, body, StatsStored } from "./features/stats";
import { credits, getUpgDefaults } from "./features/credits";
import { training } from "./features/training";
import { move } from "./features/movement";
import "./features/credits";
import { powerAugment, changePowerAugment } from "./features/augmentation";
import { updateTimeLastPlayed, offlineProgress, IOfflineProgress } from "./features/time";

import Settings, { ISettings, defaultSettings, resetData } from "./display/settings";

Game.dataManager.setData("settings", defaultSettings);

Game.init();

const autoSaves: string[] = [];

window.addEventListener("beforeunload", function (e) {
    if (!(Game.dataManager.getData("settings") as ISettings).data.saveOnExit || !gameConfig.saveOnExit) return;
    // Your code to run before the page unloads goes here
    // For example, you can save user data to a server.
    // Make sure to return a message to display to the user.
    updateTimeLastPlayed();
    Game.dataManager.saveData();
    // e.returnValue = "Are you sure you want to leave this page?";
});

Game.eventManager.setEvent("save", "interval", 30e3, () => {
    if (!(Game.dataManager.getData("settings") as ISettings).data.autosave) return;
    updateTimeLastPlayed();
    Game.dataManager.saveData();
    autoSaves.push(Game.dataManager.compileData());
    console.log("Auto save complete.");
});

const dataState = Game.dataManager.loadData();

// Backwards compatibility
// console.log("c", player.training);

// Object.assign({}, player, {
//     training: {
//         // type: "power",
//         // area: Game.dataManager.getData("currentArea") ?? 0,
//         current: "power",
//         powerArea: Game.dataManager.getData("currentArea") ?? 0,
//     },
//     augment: {
//         current: Game.dataManager.getData("currentAugment") ?? 0,
//     },
// });

// if old data exists, reset it
if (Game.dataManager.getData("currentArea")) resetData();
// console.log("b", player.training);

Object.assign(player, Game.dataManager.getData("player") ?? {});
// console.log("a", player.training, Game.dataManager.getData("player"));

// const progress = offlineProgress();
const [currentAreaType, currentArea] = [player.training.current, player.training[`${player.training.current}Area`]];

// Move all areas before moving to the current area
move.power(player.training.powerArea, true);
move.body(player.training.bodyArea, true);
move.mind(player.training.mindArea, true);

// console.log("move", player.training.current, currentArea);

move[currentAreaType](currentArea, true);


// const currentAugment = Game.dataManager.getData("currentAugment") ?? 0;
const currentAugment = player.augment.current;
changePowerAugment(currentAugment, false, true);

import "./css/bootstrap.min.css";

import StatsMenu from "./display/statsMenu";
import TrainingMenu from "./display/trainingMenu";
import AugmentMenu from "./display/augmentsMenu";
import AdvancedUpgradesMenu from "./display/upgrades";
// TODO: CheatsMenu
import CheatsMenu from "./display/cheats";
import OfflineProgress from "./display/global/offlineProgress";
import Alerts, { defaultAlerts } from "./display/global/alerts";
import { gameFormatClass } from "./display/global/format";
// import Hotkeys from "./display/hotkeys";
// import Tutorial from "./display/tutorial";
import Navbar from "./display/navbar";

/**
 * @returns The main app component
 */
function App () {
    // Misc / Global
    const [renderCount, setRenderCount] = useState(0);
    const [progress, setProgress] = useState<IOfflineProgress>();
    const [settings, setSettings] = useState<ISettings>((Game.dataManager.getData("settings") as ISettings | undefined) ?? defaultSettings);
    const [alertPopup, setAlertPopup] = useState(defaultAlerts);

    const gameFormats = new gameFormatClass(settings.display.format ?? defaultSettings.display.format);

    // Stats
    const [statsStored, setStatsStored] = useState<StatsStored>({
        power: power.value,
        mind: mind.value,
        body: body.value,
        credits: credits.value,
    });

    // Training
    const [currentTrainingArea, setCurrentTrainingArea] = useState(training.power.formatArea(currentArea, gameFormats.format));

    // Augmentation
    const [currentAugmentStr, setCurrentAugmentStr] = useState(powerAugment.formatArea(currentAugment, gameFormats.format));

    // Basic stat upgrade
    // const [basicStatUpgCost, setBasicStatUpgCost] = useState({
    //     credits: credits.static.getNextCost("upg1Credits"),
    //     power: power.static.boost.getBoosts("boostUpg1Credits")[0].value(E(1)),
    // });
    const [basicStatUpg, setBasicStatUpg] = useState(getUpgDefaults());
    // setBasicStatUpg = () => setBasicStatUpg(getUpgDefaults());
    // Update the settings when they change
    useEffect(() => {
        // const newSettings = {
        //     ...settings,
        //     display: {
        //         ...settings.display,
        //         format: {
        //             ...settings.display.format,
        //             formatType: settings.display.format ?? settings.display.format.formatType,
        //             formatTimeType: settings.display.format ?? settings.display.format.formatTimeType,
        //         },
        //     },
        // };
        // Backwards compatibility
        if (typeof settings.display.format === "string" && typeof (settings.display as unknown as { timeFormat: FormatTimeType }).timeFormat === "string") {
            const preFormat = settings.display.format as unknown as FormatType;
            settings.display.format = {
                ...defaultSettings.display.format,
                formatType: preFormat,
                formatTimeType: (settings.display as unknown as { timeFormat: FormatTimeType }).timeFormat,
            };
            delete (settings.display as unknown as { formatTimeType?: FormatTimeType }).formatTimeType;
        }
        Game.dataManager.setData("settings", settings);
    }, [settings]);

    // Rerender the game when the format changes
    useEffect(() => {
        // setCurrentTrainingArea(training.power.formatArea(player.training.area, gameFormats.format));
        setCurrentTrainingArea(training[currentAreaType].formatArea(currentArea, gameFormats.format));
        setCurrentAugmentStr(powerAugment.formatArea(currentAugment, gameFormats.format));
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

    const showWelcomeMessage = () => setAlertPopup({
        title: "Welcome",
        body: <>
            Welcome to the game! This is a work in progress, so expect bugs and unfinished features.
            <br />
            To get started, click on the tutorial button in the top right corner.
            <br />
            This game has offline progress, and is meant to be played in the background.
        </>,
    });

    // Welcome message
    useEffect(() => {
        if (settings.display.disableWelcomeMessage) return;
        showWelcomeMessage();
        // After the welcome message is shown, disable it
        settings.display.disableWelcomeMessage = true;
    }, []);

    // Update the power and credits values every frame
    useEffect(() => {
        // Update the power and credits values every frame
        // setPowerStored(power.value);
        // setCreditsStored(credits.value);
        setStatsStored({
            power: power.value,
            mind: mind.value,
            body: body.value,
            credits: credits.value,
        });
    }, [renderCount]);

    return (<>
        {progress && <OfflineProgress
            progress={progress}
            gameFormats={gameFormats}
            // gameFormatTime={gameFormatTime}
            dataState={dataState}
        />}
        <Alerts
            alertPopup={alertPopup}
            setAlertPopup={setAlertPopup}
        />
        <Navbar
            gameFormat={gameFormats}
        />
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
            <StatsMenu
                renderCount={renderCount}
                gameFormats={gameFormats}
                // gameFormatGain={gameFormatGain}
                // powerStored={powerStored}
                // creditsStored={creditsStored}
                statsStored={statsStored}
                basicStatUpg={basicStatUpg}
                setBasicStatUpg={setBasicStatUpg}
            />
            <TrainingMenu
                renderCount={renderCount}
                currentTrainingArea={currentTrainingArea}
                setCurrentTrainingArea={setCurrentTrainingArea}
                setAlertPopup={setAlertPopup}
                gameFormats={gameFormats}
                settings={settings}
                // gameFormatTime={gameFormatTime}
            />
            <AugmentMenu
                renderCount={renderCount}
                setCurrentTrainingArea={setCurrentTrainingArea}
                currentAugmentStr={currentAugmentStr}
                setCurrentAugmentStr={setCurrentAugmentStr}
                setAlertPopup={setAlertPopup}
                gameFormats={gameFormats}
                settings={settings}
                // gameFormatTime={gameFormatTime}
            />
            <AdvancedUpgradesMenu
                renderCount={renderCount}
                statsStored={statsStored}
                basicStatUpg={basicStatUpg}
                setBasicStatUpg={setBasicStatUpg}
                gameFormats={gameFormats}
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
            renderCount={renderCount}
            // setBasicStatUpgCost={setBasicStatUpgCost} // TODO
            setAlertPopup={setAlertPopup}
            setCurrentTrainingArea={setCurrentTrainingArea}
            gameFormats={gameFormats}
            // gameFormat={gameFormat} // Add the missing gameFormat property
            basicStatUpg={basicStatUpg}
            setBasicStatUpg={setBasicStatUpg}
            showWelcomeMessage={showWelcomeMessage}
        />
    </>);
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);