/**
 * @file Display components
 */
import React, { useEffect, useState } from "react";
import { power } from "../features/stats";
import { credits } from "../features/credits";

// addLoopFunction((dt) => {
//     Game.static.stats.power.gain(dt);
//     document.getElementById('power').innerHTML = `✊ | Power: ${Game.data.stats.power.value.format()}`;
// });

// addLoopFunction((dt) => {
//     Game.static.credits.currency.gain(dt);
//     document.getElementById("credits").innerHTML = `🪙 | Credits: ${Game.data.credits.currency.value.format()}`;
// });

/**
 * The main display component
 */
function Display() {
    const [renderCount, setRenderCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRenderCount((prevCount) => prevCount + 1);
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const powerElement = document.getElementById("power") as HTMLElement;
        powerElement.innerHTML = `✊ | Power: ${power.value.format()}`;
    }, [power, renderCount]);

    useEffect(() => {
        const creditsElement = document.getElementById("credits") as HTMLElement;
        creditsElement.innerHTML = `🪙 | Credits: ${credits.value.format()}`;
    }, [credits, renderCount]);

    return (
        <div>
            <div id="power">✊ | Power: {power.value.format()}</div>
            <div id="credits">🪙 | Credits: {credits.value.format()}</div>
        </div>
    );
}

export default Display;