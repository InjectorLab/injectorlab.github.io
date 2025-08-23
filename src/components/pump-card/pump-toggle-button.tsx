import {Button, Skeleton} from "@chakra-ui/react";
import { useConnection } from "../../context/connection-context.tsx";
import type {PumpStatus} from "./pump.type.tsx";

export default function PumpToggleButton({pumpStatus}: { pumpStatus: PumpStatus | undefined }) {
    const { status: connStatus, send } = useConnection();
    const isConnected = connStatus === "open";
    const isOn = pumpStatus?.on === true;

    if (!isConnected || !pumpStatus) {
        return <Skeleton h="36px" w="100%" rounded="md" />;
    }

    const handleToggle = () => {
        send({ type: "pump.set", on: !pumpStatus.on, cutoff: pumpStatus.cutoff, max: pumpStatus.max });
    };

    return (
        <Button
            onClick={handleToggle}
            colorPalette={isOn ? "red" : "green"}
            variant={isOn ? "outline" : "solid"}
            disabled={!isConnected}
            w={{ base: "100%" }}
        >
            {isOn ? "Выключить насос" : "Включить насос"}
        </Button>
    );
}