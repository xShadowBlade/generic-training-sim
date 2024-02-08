/**
 * @file Alert / notification info system
 */
import React, { useEffect, useState, useCallback } from "react";
// import Alert from "react-bootstrap/Alert";
// @ts-expect-error - Doesnt have types
import { AlertList, Alert } from "react-bs-notifier";

interface IAlerts {
    id: number;
    type: "info" | "warning" | "danger" | "success";
    headline?: string;
    message: string;
}

// eslint-disable-next-line jsdoc/require-param
/**
 * @returns The alerts component
 */
function Alerts ({ alerts, setAlerts }: { alerts: IAlerts[], setAlerts: (alerts: IAlerts[]) => void}) {
    const [alertList, setAlertList] = useState(alerts);

    const onDismissed = useCallback((alert: IAlerts) => {
        // @ts-expect-error - idk
        setAlerts((alertsToRm: IAlerts[]) => {
            const idx = alertsToRm.indexOf(alert);
            if (idx < 0) return alertsToRm;
            return [...alertsToRm.slice(0, idx), ...alertsToRm.slice(idx + 1)];
        });
    }, []);

    // const addAlert = (alert: IAlerts) => {
    //     setAlerts([...alerts, alert]);
    // };

    useEffect(() => {
        setAlertList(alerts);
    }, [alerts]);

    return (
        <>
            <Alert type="info" headline="Optional Headline" showIcon>
                This is a message that explains what happened in a little more detail.
            </Alert>
            <AlertList
                position="top-right"
                alerts={alertList}
                timeout={2000}
                dismissTitle="Dismiss"
                onDismiss={onDismissed}
            />
        </>
    );
}

export default Alerts;
export { IAlerts };