import { useMemo, useState } from "react";
import { Button, HStack, Portal, Select, Skeleton, createListCollection } from "@chakra-ui/react";
import { useConnection } from "../../context/connection-context";
import type { InjectorStatus } from "./injector.type";

type Props = {
    status?: InjectorStatus;
    injectorCount?: number;
};

export default function InjectorShotControl({ status, injectorCount = 4 }: Props) {
    const { status: connStatus, send } = useConnection();
    const isConnected = connStatus === "open";
    const [value, setValue] = useState<number[]>([1]);

    const collection = useMemo(
        () =>
            createListCollection({
                items: Array.from({ length: injectorCount }, (_, i) => ({
                    label: `Форсунка #${i + 1}`,
                    value: String(i + 1),
                })),
            }),
        [injectorCount]
    );

    if (!status) return <Skeleton h="36px" w="100%" rounded="md" />;

    const spitOnce = () => {
        const n = Number(value?.[0] ?? "1");
        if (Number.isFinite(n) && n >= 1 && n <= injectorCount) {
            send({ type: "inj.open", pattern: [n], repeat: 1 });
        }
    };

    return (
        <HStack gap="2" w="100%" align="end">
            <Select.Root
                value={[String(value)]}
                onValueChange={({ value }) => setValue([Number(value)])}
                collection={collection}
            >
                <Select.HiddenSelect name="injector_index" />
                <Select.Control flex="1">
                    <Select.Trigger>
                        <Select.ValueText placeholder="Выберите форсунку" />
                    </Select.Trigger>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {collection.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                    {item.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>

            <Button
                onClick={spitOnce}
                minW="120px"
                whiteSpace="nowrap"
                disabled={!isConnected}
            >
                Активировать
            </Button>
        </HStack>
    );
}