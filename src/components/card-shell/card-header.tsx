import {HStack, Text} from "@chakra-ui/react";
import StatusBar from "./status-bar.tsx";

type CardHeaderProps = {
    description: string;

    loading?: boolean;
    on?: boolean;

    onText: string;
    offText: string;
};

export default function CardHeader({
                                      description,
                                      loading,
                                      on = false,
                                      onText,
                                      offText
                                  }: CardHeaderProps) {
    const statusBar = (
        <StatusBar onText={onText} offText={offText} on={on} loading={loading}/>
    )

    return (
        <HStack justify="space-between" align="center">
            <Text fontWeight="semibold">
                {description}
            </Text>
            {statusBar}
        </HStack>
    );
}