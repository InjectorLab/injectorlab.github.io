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
    const { status: connectionStatus, send } = useConnection();
    const isConnected = connectionStatus === "open";

    const [hours, setHours] = React.useState(0);
    const [minutes, setMinutes] = React.useState(0);
    const [seconds, setSeconds] = React.useState(10);
    const [running, setRunning] = React.useState(false);

    const timerRef = React.useRef<any | null>(null);

    function getTotalSeconds(): number {
        return hours * 3600 + minutes * 60 + seconds;
    }

    function tickDown() {
        setSeconds((prevSec) => {
            if (prevSec > 0) {
                return prevSec - 1;
            } else {
                setMinutes((prevMin) => {
                    if (prevMin > 0) {
                        setSeconds(59);
                        return prevMin - 1;
                    } else {
                        setHours((prevHour) => {
                            if (prevHour > 0) {
                                setMinutes(59);
                                setSeconds(59);
                                return prevHour - 1;
                            } else {
                                stopTimer();
                                return 0;
                            }
                        });
                        return 0;
                    }
                });
                return 0;
            }
        });

        send({ type: "inj.open", pattern: [1, 2, 3, 4], repeat: 100 });
    }

    function startTimer() {
        if (!isConnected) {
            return;
        }
        if (getTotalSeconds() <= 0) {
            return;
        }

        setRunning(true);
        timerRef.current = window.setInterval(tickDown, 1000);
    }

    function stopTimer() {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        send({ type: "inj.stop" });
        setRunning(false);
    }

    React.useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

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
                        disabled={!isConnected || getTotalSeconds() <= 0}
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