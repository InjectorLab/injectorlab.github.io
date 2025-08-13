import {DataList, Stack} from "@chakra-ui/react";
import EditableNumber from "../editable-number";
import type { InjectorStatus } from "./injector.type";
import { useConnection } from "../../context/connection-context";
import CardHeader from "../card-shell/card-header.tsx";
import DataListSkeleton from "../card-shell/data-list-skeleton.tsx";

type Props = { status?: InjectorStatus };

export default function InjectorStatusView({ status }: Props) {
    const { status: connStatus, send } = useConnection();
    const isConnected = connStatus === "open";

    const cardHeader = (
        <CardHeader onText={"В работе"} offText={"Простаивает"} description={"Форсунки"}
                    on={status?.running} loading={status === undefined}/>
    )

    if (!status) {
        return (
            <Stack gap={2}>
                {cardHeader}
                <Stack gap={2}>
                    <DataListSkeleton labels={["Задержка", "Время открытия"]}/>
                </Stack>
            </Stack>

        );
    }

    return (
        <Stack gap={2}>
            {cardHeader}

            <Stack gap={2} paddingTop="2">
                <DataList.Root orientation="horizontal" gap="4">
                    <DataList.Item>
                        <DataList.ItemLabel>Задержка</DataList.ItemLabel>
                        <DataList.ItemValue>
                            <EditableNumber
                                value={status.delay}
                                unit="мс"
                                min={0}
                                max={2000}
                                step={1}
                                disabled={!isConnected}
                                onSubmit={(next) => {
                                    send({ type: "inj.set", delay: next, pulse: status.pulse });
                                }}
                            />
                        </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                        <DataList.ItemLabel>Время открытия</DataList.ItemLabel>
                        <DataList.ItemValue>
                            <EditableNumber
                                value={status.pulse}
                                unit="мс"
                                min={0}
                                max={50}
                                step={1}
                                disabled={!isConnected}
                                onSubmit={(next) => {
                                    send({ type: "inj.set", pulse: next, delay: status.delay });
                                }}
                            />
                        </DataList.ItemValue>
                    </DataList.Item>
                </DataList.Root>
            </Stack>
        </Stack>
    );
}