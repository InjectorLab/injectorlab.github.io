import {Stack, Button, DataList} from "@chakra-ui/react";
import EditableNumber from "../editable-number";
import CardHeader from "../card-shell/card-header";
import { useConnection } from "../../context/connection-context";
import React from "react";
import CardShell from "../card-shell/card-shell.tsx";

function clampToRange(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) {
        return min;
    }
    return Math.min(max, Math.max(min, Math.floor(value)));
}

export default function TimerCard() {
    const { status: connectionStatus, send, onMessage } = useConnection();
    const isConnected = connectionStatus === "open";

    const [hours, setHours] = React.useState(0);
    const [minutes, setMinutes] = React.useState(0);
    const [seconds, setSeconds] = React.useState(10);
    const [running, setRunning] = React.useState(false);

    function getTotalMs(): number {
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
    }

    function startTimer() {
        if (!isConnected || getTotalMs() <= 0) {
            return;
        }

        send({ type: "timer.start", time: getTotalMs() });
    }

    function stopTimer() {
        send({ type: "timer.stop" });
    }

    React.useEffect(() => {
        const off = onMessage((msg: any) => {
            if (msg?.type === "timer.status") {
                setRunning(Boolean(msg.running));
                const remaining = Number(msg.remaining) ?? 0;

                const h = Math.floor(remaining / 3600000);
                const m = Math.floor((remaining % 3600000) / 60000);
                const s = Math.floor((remaining % 60000) / 1000);

                setHours(h);
                setMinutes(m);
                setSeconds(s);
            }
        });

        send({ type: "timer.status" });

        return () => off?.();
    }, [onMessage, send]);

    return (
        <CardShell>
            <Stack gap={2}>
                <CardHeader
                    onText="Запущен"
                    offText="Остановлен"
                    description="Таймер"
                    on={running}
                    loading={false}
                />

                <Stack gap={2} paddingTop="2">
                    <DataList.Root orientation="horizontal">
                        <DataList.Item>
                            <DataList.ItemLabel>Часы</DataList.ItemLabel>
                            <DataList.ItemValue justifyContent="flex-end">
                                <EditableNumber
                                    value={hours}
                                    onSubmit={(newValue) => {
                                        setHours(clampToRange(newValue, 0, Number.MAX_SAFE_INTEGER))
                                    }}
                                    min={0}
                                    max={12}
                                    step={1}
                                    disabled={running}
                                />
                            </DataList.ItemValue>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.ItemLabel>Минуты</DataList.ItemLabel>
                            <DataList.ItemValue justifyContent="flex-end">
                                <EditableNumber
                                    value={minutes}
                                    onSubmit={(newValue) => {
                                        setMinutes(clampToRange(newValue, 0, 59));
                                    }}
                                    min={0}
                                    max={59}
                                    step={1}
                                    disabled={running}
                                />
                            </DataList.ItemValue>
                        </DataList.Item>

                        <DataList.Item>
                            <DataList.ItemLabel>Секунды</DataList.ItemLabel>
                            <DataList.ItemValue justifyContent="flex-end">
                                <EditableNumber
                                    value={seconds}
                                    onSubmit={(newValue) => {
                                        setSeconds(clampToRange(newValue, 0, 59))
                                    }}
                                    min={0}
                                    max={59}
                                    step={1}
                                    disabled={running}
                                />
                            </DataList.ItemValue>
                        </DataList.Item>
                    </DataList.Root>
                </Stack>

                {!running ? (
                    <Button
                        colorPalette="green"
                        onClick={startTimer}
                        w="100%"
                        disabled={!isConnected || getTotalMs() <= 0}
                    >
                        Старт
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        colorPalette="red"
                        onClick={stopTimer}
                        w="100%"
                    >
                        Стоп
                    </Button>
                )}
            </Stack>
        </CardShell>
    );
}