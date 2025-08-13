import {DataList, Stack, Text} from "@chakra-ui/react";
import type {PumpStatus} from "./pump.type.tsx";
import PumpCutoffSetter from "./pump-cutoff-setter.tsx";
import CardHeader from "../card-shell/card-header.tsx";
import DataListSkeleton from "../card-shell/data-list-skeleton.tsx";

export default function PumpStatusView({pumpStatus}: { pumpStatus: PumpStatus | undefined }) {
    const cardHeader = (
        <CardHeader onText={"Включён"} offText={"Выключен"} description={"Насос"}
                    on={pumpStatus?.on} loading={pumpStatus === undefined}/>
    )


    if (!pumpStatus) {
        return (
            <Stack gap={2}>
                {cardHeader}
                <Stack gap={2}>
                    <DataListSkeleton labels={["Датчик давления", "Порог"]}/>
                </Stack>
            </Stack>
        );
    }


    return (
        <Stack gap={2}>
            {cardHeader}

            <Stack gap={2} paddingTop="4">
                <DataList.Root orientation="horizontal">
                    <DataList.Item>
                        <DataList.ItemLabel>Датчик давления</DataList.ItemLabel>
                        <DataList.ItemValue justifyContent="flex-end">
                            <Text>
                                {pumpStatus.pressure} мВ
                            </Text>
                        </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Порог</DataList.ItemLabel>
                        <DataList.ItemValue justifyContent="flex-end">
                            <PumpCutoffSetter pumpStatus={pumpStatus}/>
                        </DataList.ItemValue>
                    </DataList.Item>
                </DataList.Root>
            </Stack>
        </Stack>
    );
}