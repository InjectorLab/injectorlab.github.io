import { Skeleton } from "@chakra-ui/react";
import { useConnection } from "../../context/connection-context.tsx";
import type { PumpStatus } from "./pump.type.tsx";
import EditableNumber from "../editable-number.tsx";

export default function PumpPowerSetter(props: { pumpStatus: PumpStatus | undefined }) {
    const { pumpStatus } = props;
    const { status: connectionStatus, send } = useConnection();
    const isConnected = connectionStatus === "open";

    function handleApplyPower(value: number) {
        if (!isConnected) {
            return;
        }

        if (!pumpStatus) {
            return;
        }

        send({
            type: "pump.set",
            on: pumpStatus.on,
            cutoff: pumpStatus.cutoff,
            max: value
        });
    }

    if (isConnected && pumpStatus === undefined) {
        return (
            <Skeleton h="36px" w="120px" rounded="md" />
        );
    }

    return (
        <EditableNumber value={pumpStatus?.max}
                        unit={"%"}
                        onSubmit={handleApplyPower}
                        min={10}
                        max={100} />
    );
}