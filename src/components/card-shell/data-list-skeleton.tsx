import { DataList, Skeleton } from "@chakra-ui/react";

type DataListSkeletonProps = {
    labels: string[];
    orientation?: "horizontal" | "vertical";
};

export default function DataListSkeleton({
                                             labels,
                                             orientation = "horizontal",
                                         }: DataListSkeletonProps) {
    return (
        <DataList.Root orientation={orientation}>
            {labels.map((label) => (
                <DataList.Item key={label} paddingTop="3">
                    <DataList.ItemLabel>{label}</DataList.ItemLabel>
                    <DataList.ItemValue>
                        <Skeleton h="20px" w="full" />
                    </DataList.ItemValue>
                </DataList.Item>
            ))}
        </DataList.Root>
    );
}