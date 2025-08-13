import { Stack } from "@chakra-ui/react";
import CardShell from "../card-shell/card-shell";
import { useConnection } from "../../context/connection-context";
import { useEffect, useState } from "react";
import type { InjectorStatus } from "./injector.type";
import InjectorStatusView from "./injector-status-view";
import InjectorShotControl from "./injector-shot-control";

export default function InjectorConfigCard() {
    const { onMessage } = useConnection();
    const [injStatus, setInjStatus] = useState<InjectorStatus | undefined>(undefined);

    useEffect(() => {
        const off = onMessage((msg: any) => {
            if (msg?.type === "inj.status") {
                setInjStatus({
                    running: Boolean(msg.running),
                    delay: Number(msg.delay) ?? 0,
                    pulse: Number(msg.pulse) ?? 0,
                });
            }
        });
        return () => off?.();
    }, [onMessage]);

    return (
        <CardShell>
            <Stack gap="3" h="100%" justifyContent="space-between">
                <InjectorStatusView status={injStatus} />
                <InjectorShotControl status={injStatus} injectorCount={4} />
            </Stack>
        </CardShell>
    );
}