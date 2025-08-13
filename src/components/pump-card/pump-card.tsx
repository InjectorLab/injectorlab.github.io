import type {PumpStatus} from "./pump.type.tsx";

import {Box, SimpleGrid, Stack} from "@chakra-ui/react";
import CardShell from "../card-shell/card-shell.tsx";
import PumpStatusView from "./pump-status-view.tsx"
import {useConnection} from "../../context/connection-context.tsx";
import {useEffect, useState} from "react";
import PumpToggleButton from "./pump-toggle-button.tsx";


export default function PumpCard() {
    const { status: connectionStatus, onMessage } = useConnection();

    const isConnected = connectionStatus === "open";

    const [pumpStatus, setPumpStatus] = useState<PumpStatus | undefined>(undefined);

    useEffect(() => {
        return onMessage((message) => {
            if ((message as any)?.type !== "pump.status") {
                return;
            }

            const { on, pressure, cutoff } = message as any;

            setPumpStatus({
                on: !!on,
                pressure: Number(pressure) || 0,
                cutoff: Number(cutoff),
            });
        });
    }, [onMessage]);

    useEffect(() => {
        if (!isConnected) {
            setPumpStatus(undefined);
        }
    }, [isConnected]);

    return (
        <CardShell>
            <Stack gap={3} h="100%" justifyContent="space-between">
                <PumpStatusView pumpStatus={pumpStatus} />

                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2}>
                    <Box gridColumn="1 / -1">
                        <PumpToggleButton pumpStatus={pumpStatus} />
                    </Box>
                </SimpleGrid>
            </Stack>
        </CardShell>
    );
}

