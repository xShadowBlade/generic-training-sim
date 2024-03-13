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
function buyAdvancedStatUpg ({ setBasicStatUpg, upg }: Pick<AdvancedUpgradesMenuProps, "setBasicStatUpg"> & { upg: number }) {
    // Function implementation
    // console.log("Buying advanced stat upgrade");
    credits.static.buyUpgrade(`upg${upg}Credits`);
    setBasicStatUpg(getUpgDefaults());
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns Advanced upgrades buy button
 */
function AdvancedUpgradesBuyButton (props: AdvancedUpgradesMenuProps & { children: React.ReactNode, id: number }) {
    const { children, id } = props;
    return (
        <Button
            type="button"
            onClick={() => buyAdvancedStatUpg({ ...props, upg: id })}
            disabled={props.statsStored.credits.lt((props.basicStatUpg as Record<number, ReturnType<typeof getUpgDefaults>[keyof ReturnType<typeof getUpgDefaults>]>)[id]?.cost ?? E(0))}
            style={{
                marginBottom: "5px",
            }}
        >
            {children}
        </Button>
    );

}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns Advanced upgrades menu
 */
function AdvancedUpgradesMenu (props: AdvancedUpgradesMenuProps) {
    const { statsStored, basicStatUpg, gameFormats } = props;
    const creditsStored = statsStored.credits;
    // const upgCost = basicStatUpg.advanced?.cost ?? E(0);
    const upgCosts = {
        4: basicStatUpg.advanced.cost,
        5: basicStatUpg.keepPower.cost,
        6: basicStatUpg.keepCreditsOnUpgrade.cost,
    };
    return (
        <Accordion.Item eventKey="3">
            <Accordion.Header>Advanced Upgrades</Accordion.Header>
            <Accordion.Body>
                <AdvancedUpgradesBuyButton {...props} id={4}>
                    {`Buy Advanced Stat Upgrade [Level: ${basicStatUpg.advanced.level}] (🪙 | Cost: ${gameFormats.format(upgCosts[4])}) {Effect: ${gameFormats.format(basicStatUpg.advanced.factor)}}`}
                </AdvancedUpgradesBuyButton>
                <br />
                <AdvancedUpgradesBuyButton {...props} id={5}>
                    {`Buy Keep Power on Reset Upgrade [Active: ${basicStatUpg.keepPower.keep}] (🪙 | Cost: ${gameFormats.format(upgCosts[5])})`}
                </AdvancedUpgradesBuyButton>
                <br />
                <AdvancedUpgradesBuyButton {...props} id={6}>
                    {`Buy Keep Credits on Upgrade Upgrade [Active: ${basicStatUpg.keepCreditsOnUpgrade.keep}] (🪙 | Cost: ${gameFormats.format(upgCosts[6])})`}
                </AdvancedUpgradesBuyButton>
            </Accordion.Body>
        </Accordion.Item>
    );
}

export default AdvancedUpgradesMenu;