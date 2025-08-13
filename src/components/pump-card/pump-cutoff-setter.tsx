import { Skeleton } from "@chakra-ui/react";
import { useConnection } from "../../context/connection-context.tsx";
import type { PumpStatus } from "./pump.type.tsx";
import EditableNumber from "../editable-number.tsx";

export default function PumpCutoffSetter(props: { pumpStatus: PumpStatus | undefined }) {
    const { pumpStatus } = props;
    const { status: connectionStatus, send } = useConnection();
    const isConnected = connectionStatus === "open";

    function handleApplyCutoff(value: number) {
        if (!isConnected) {
            return;
        }

        if (!pumpStatus) {
            return;
        }

        send({
            type: "pump.set",
            on: pumpStatus.on,
            cutoff: value,
        });
    }

    if (isConnected && pumpStatus === undefined) {
        return (
            <Skeleton h="36px" w="120px" rounded="md" />
        );
    }

    return (
        <EditableNumber value={pumpStatus?.cutoff}
                        unit={"мВ"}
                        onSubmit={handleApplyCutoff}
                        min={0}
                        max={9999} />
    );
}