/**
 * @file Training menu
 */

import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Dropdown from "react-bootstrap/Dropdown";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { E } from "emath.js";
import { player } from "../game";
import { training } from "../features/training";
import { multiplierBasedArea } from "../utility/area";
import { move, AreaType } from "../features/movement";
import { power } from "../features/stats";
import { ISettings } from "./settings";
import { gameFormatClass } from "./global/format";
import { IAlerts } from "./global/alerts";

interface TrainingMenuProps {
    renderCount: number,
    currentTrainingArea: string,
    setCurrentTrainingArea: (area: string) => void,
    // alertPopup: IAlerts,
    setAlertPopup: (alertPopup: IAlerts) => void,
    // gameFormat: (value: E) => string,
    // gameFormatTime: (value: E) => string,
    gameFormats: gameFormatClass,
    settings: ISettings,
}

/**
 * Moves to the specified training area
 * @param areaType - The type of training area to move to
 * @param area - The training area to move to
 * @param props - The training menu props
 */
function moveToAreaWithCheck (areaType: AreaType, area: number, { setAlertPopup, setCurrentTrainingArea, gameFormats, settings }: Pick<TrainingMenuProps, "setAlertPopup" | "setCurrentTrainingArea" | "gameFormats" | "settings">) {
    if (area < 0) return;
    const areaClass = training[areaType];
    const moveArea = move[areaType];
    if (!moveArea(area)) {
        if (settings.display.trainingAreaFailPopup) {
            setAlertPopup({
                title: "Failed to move to area",
                body: `You are not strong enough to train in this area. (You need ${gameFormats.format(areaClass.getArea(area).req)} ${areaClass.stat.name})`,
            });
        }
        return;
    }
    setCurrentTrainingArea(areaClass.formatArea(area, gameFormats.format));
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns A single training area sub-component
 */
function TrainingMenuStat (props: TrainingMenuProps & { areaType: AreaType, showProgressBar?: boolean }) {
    const { renderCount, currentTrainingArea, gameFormats, showProgressBar, areaType } = props;
    const { format, time } = gameFormats;
    const area = training[areaType];
    const { stat, areas } = area;

    const [trainingProgressBar, setTrainingProgressBar] = useState([0, "", ""] as [number, string, string]);

    const renderTrainingAreaDropdown = () => {
        const out = [];
        for (let i = 0; i < areas.length; i++) {
            out.push(<Dropdown.Item key={`training-area-${stat.name}-${i}`} onClick={() => moveToAreaWithCheck(areaType, i, props)}>{area.formatArea(i, format)}</Dropdown.Item>);
        }
        return out;
    };

    /**
     * Renders the training area progress bars
     * @returns Tuple of the training area progress bars
     */
    function progressBars (): [number, string, string] {
        // if (playerState[0] !== "idle") return [0, "", ""];
        const getTrainingArea = area.getArea;
        const currentArea = player.training[`${areaType}Area`];
        const playerP = stat.value;
        const percent = Math.min(playerP.div(getTrainingArea(currentArea + 1).req).mul(100).toNumber(), 100);

        // Time remaining
        const playerDiffBetweenAreas = getTrainingArea(currentArea + 1).req.sub(playerP);
        const timeRemaining = time(E.max(0, playerDiffBetweenAreas.div(stat.static.boost.calculate())));
        return [percent, timeRemaining, `${format(stat.value)} / ${format(getTrainingArea(currentArea + 1).req)}`];
    }

    useEffect(() => {
        setTrainingProgressBar(progressBars());
    }, [renderCount]);

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Move to...
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {renderTrainingAreaDropdown()}
                </Dropdown.Menu>
            </Dropdown>
            {showProgressBar && <>
                <p>{currentTrainingArea}</p>
                <p>{`Progress to next area: ${trainingProgressBar[0].toFixed(2)}% (${trainingProgressBar[2]}) [${trainingProgressBar[1]} remaining]`}</p>
                <ProgressBar
                    animated
                    id="trainingProgressBar"
                    now={trainingProgressBar[0]}
                />
            </>}
        </>
    );
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The training menu component
 */
function TrainingMenu (props: TrainingMenuProps) {
    const { renderCount, currentTrainingArea, gameFormats, settings } = props;
    // const { format, time } = gameFormats;

    return (
        <Accordion.Item eventKey="1">
            <Accordion.Header>Training Areas</Accordion.Header>
            <Accordion.Body>
                <h1>Power</h1>
                <TrainingMenuStat {...props} areaType={"power"} showProgressBar={player.training.current === "power"} />
                <hr />
                <h1>Body</h1>
                <TrainingMenuStat {...props} areaType={"body"} showProgressBar={player.training.current === "body"} />
                <hr />
                <h1>Mind</h1>
                <TrainingMenuStat {...props} areaType={"mind"} showProgressBar={player.training.current === "mind"} />
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default TrainingMenu;
export { TrainingMenuProps, moveToAreaWithCheck };