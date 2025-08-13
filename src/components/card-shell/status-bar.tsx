import {HStack, Box, Text, Skeleton, Stack} from "@chakra-ui/react";

type StatusBarProps = {
    loading?: boolean;    // Показать skeleton
    on?: boolean;         // Включено или нет
    onText: string;       // Текст при on = true
    offText: string;      // Текст при on = false
};

export default function StatusBar({
                                      loading,
                                      on = false,
                                      onText,
                                      offText
                                  }: StatusBarProps) {
    const dotSize = "10px";
    const onColor = "green.400";
    const offColor = "gray.400";
    const ring = true;

    if (loading) {
        return (
            <Stack width="full" align="end">
                <Skeleton h="20px" w="full"/>
            </Stack>
        );
    }

    return (
        <HStack gap="2" align="center">
            <Box
                w={dotSize}
                h={dotSize}
                rounded="full"
                bg={on ? onColor : offColor}
                boxShadow={ring ? "inset 0 0 0 1px rgba(0,0,0,0.1)" : undefined}
            />
            <Text fontSize="sm" color="blackAlpha.700">
                {on ? onText : offText}
            </Text>
        </HStack>
    );
}