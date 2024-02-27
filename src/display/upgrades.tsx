/**
 * @file Advanced upgrades menu
 */
import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import { E } from "emath.js";
import { StatsStored } from "../features/stats";
import { credits, getUpgDefaults } from "../features/credits";
import { gameFormatClass } from "./global/format";

interface AdvancedUpgradesMenuProps {
    renderCount: number,
    statsStored: StatsStored,
    basicStatUpg: ReturnType<typeof getUpgDefaults>,
    setBasicStatUpg: (basicStatUpgCost: ReturnType<typeof getUpgDefaults>) => void,
    gameFormats: gameFormatClass,
}

// eslint-disable-next-line jsdoc/require-param
/**
 * Buys and renders the advanced stat upgrade
 */
function buyAdvancedStatUpg ({ setBasicStatUpg, basicStatUpg }: Pick<AdvancedUpgradesMenuProps, "setBasicStatUpg" | "basicStatUpg">) {
    // Function implementation
    console.log("Buying advanced stat upgrade");
    credits.static.buyUpgrade(`upg4Credits`);
    setBasicStatUpg(getUpgDefaults());
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns Advanced upgrades menu
 */
function AdvancedUpgradesMenu (props: AdvancedUpgradesMenuProps) {
    const { statsStored, basicStatUpg, gameFormats } = props;
    const creditsStored = statsStored.credits;
    const upgCost = basicStatUpg.advanced?.cost ?? E(0);
    return (
        <Accordion.Item eventKey="3">
            <Accordion.Header>Advanced Upgrades</Accordion.Header>
            <Accordion.Body>
                <Button
                    type="button"
                    onClick={() => buyAdvancedStatUpg(props)}
                    disabled={creditsStored.lt(upgCost)}
                    style={{
                        marginBottom: "5px",
                    }}
                >
                    {`Buy Advanced Stat Upgrade [Level: ${basicStatUpg.advanced.level}] (🪙 | Cost: ${gameFormats.format(upgCost)}) {Effect: ${gameFormats.format(basicStatUpg.advanced.factor)}}`}
                </Button>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default AdvancedUpgradesMenu;