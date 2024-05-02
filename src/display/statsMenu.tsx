/**
 * @file Display components
 */
import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

import { power, mind, body, StatsStored, score } from "../features/stats";
import { credits, getUpgDefaults } from "../features/credits";
import { player } from "../game";
import { E } from "emath.js";
import { GameFormatClass } from "./global/format";
import { AreaType } from "../features/movement";

// eslint-disable-next-line jsdoc/require-param
/**
 * Buys and renders the basic stat upgrade
 */
function buyBasicStatUpg ({ setBasicStatUpg, basicStatUpg, upgType, buyMax }: Pick<StatsMenuProps, "setBasicStatUpg" | "basicStatUpg"> & { upgType: AreaType, buyMax?: boolean }) {
    // Function implementation
    // console.log("Buying basic stat upgrade");
    const boostId = [null, "power", "body", "mind"].indexOf(upgType) ?? 1;
    credits.static.buyUpgrade(`upg${boostId}Credits`, buyMax ? undefined : 1);
    setBasicStatUpg(getUpgDefaults());
}

interface StatsMenuProps {
    renderCount: number,
    statsStored: StatsStored,
    basicStatUpg: ReturnType<typeof getUpgDefaults>,
    setBasicStatUpg: (basicStatUpgCost: ReturnType<typeof getUpgDefaults>) => void,
    gameFormats: GameFormatClass,
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns A button to buy the basic stat upgrade for the specified stat
 */
function BuyUpgStat (props: StatsMenuProps & { upgType: AreaType }) {
    const { statsStored, upgType, gameFormats } = props;
    // const statAmt = statsStored[upgType];
    const basicStatUpg = getUpgDefaults();
    const creditsStored = statsStored.credits;
    const upgCost = basicStatUpg[upgType]?.cost ?? E(0);
    const statId = [null, "power", "body", "mind"].indexOf(upgType) ?? 1;
    // Convert upgType to a string, with the first letter capitalized
    const upgTypeStr = upgType.charAt(0).toUpperCase() + upgType.slice(1);
    // const [maxData, setMaxData] = useState({
    //     max: E(0),
    //     cost: E(0),
    // });
    // useEffect(() => {
    //     if (basicStatUpg[upgType]?.max) {
    //         setMaxData({
    //             max: basicStatUpg[upgType]?.max[0],
    //             cost: basicStatUpg[upgType]?.max[1],
    //         });
    //     }
    //     // console.log("Max data updated");
    // }, [props.renderCount]);
    return (<>
        <Button
            type="button"
            onClick={() => buyBasicStatUpg(props)}
            disabled={creditsStored.lt(upgCost)}
            style={{
                marginBottom: "5px",
                marginRight: "5px",
            }}
        >
            {`Buy Basic ${[null, "✊", "💪", "🧠"][statId]} | ${upgTypeStr} Upgrade [Level: ${basicStatUpg[upgType].level}] (🪙 | Cost: ${gameFormats.format(upgCost)})`}
        </Button>
        |
        {basicStatUpg[upgType]?.max && <Button
            type="button"
            onClick={() => buyBasicStatUpg({ ...props, buyMax: true })}
            disabled={creditsStored.lt(upgCost)}
            style={{
                marginBottom: "5px",
                marginLeft: "5px",
            }}
        >
            {/* {`Buy ${maxData.max} upgrades (🪙 | Cost: ${gameFormats.format(maxData.cost)})`} */}
            {`Buy ${basicStatUpg[upgType]?.max[0]} upgrades (🪙 | Cost: ${gameFormats.format(basicStatUpg[upgType]?.max[1])})`}
        </Button>}
    </>);
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The stats menu component
 */
// eslint-disable-next-line react/prop-types
function StatsMenu (props: StatsMenuProps) {
    const { statsStored, gameFormats } = props;
    const { format, gain } = gameFormats;

    const { power: powerStored, body: bodyStored, mind: mindStored, credits: creditsStored } = statsStored;

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>Stats</Accordion.Header>
            <Accordion.Body>
                <p>{`✊ | Power: ${format(powerStored)} [x${format((power.static.boost.getBoosts("boostUpg1Credits")[0] ?? { value: () => E(1) }).value(E(1)))}] ${player.training.current === "power" ? gain(powerStored, power.static.boost.calculate()) : ""}`}</p>
                <p>{`💪 | Body: ${format(bodyStored)} [x${format((body.static.boost.getBoosts("boostUpg2Credits")[0] ?? { value: () => E(1) }).value(E(1)))}] ${player.training.current === "body" ? gain(bodyStored, body.static.boost.calculate()) : ""}`}</p>
                <p>{`🧠 | Mind: ${format(mindStored)} [x${format((mind.static.boost.getBoosts("boostUpg3Credits")[0] ?? { value: () => E(1) }).value(E(1)))}] ${player.training.current === "mind" ? gain(mindStored, mind.static.boost.calculate()) : ""}`}</p>
                <br />
                <p>{`🪙 | Credits: ${format(creditsStored)} ${gain(creditsStored, credits.static.boost.calculate())}`}</p>
                {/* <br />
                <p>{`🏆 | Power Score: ${format(score.power)}`}</p>
                <p>{`🏆 | Body Score: ${format(score.body)}`}</p>
                <p>{`🏆 | Mind Score: ${format(score.mind)}`}</p>
                <p>{`🏆 | Total Score: ${format(score.total)}`}</p> */}

                {/* <p>{`⏫ | Current Multiplier: x${format(basicStatUpg.power)}`}</p> */}
                {/* <Button
                    type="button"
                    onClick={() => buyBasicStatUpg(props)}
                    disabled={creditsStored.lt(basicStatUpgCost.credits)}
                >
                    {`Buy Basic Stat Upgrade (Cost: ${format(basicStatUpgCost.credits)})`}
                </Button> */}
                <BuyUpgStat {...props} upgType="power" />
                <br />
                <BuyUpgStat {...props} upgType="body" />
                <br />
                <BuyUpgStat {...props} upgType="mind" />
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default StatsMenu;
export { buyBasicStatUpg, StatsMenuProps };