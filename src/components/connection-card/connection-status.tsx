import { Box, HStack, Text } from "@chakra-ui/react";
import type { WebSocketConnectionStatus } from "../../context/ws/ws-client";

export type StatusView = {
    label: string;
    hint: string;
    bg: string;
    border: string;
    dot: string;
    text: string;
};

const STATUS_STYLES: Record<WebSocketConnectionStatus, StatusView> = {
    open: {
        label: "Подключено",
        hint: "Соединение установлено",
        bg: "green.50",
        border: "green.200",
        dot: "green.400",
        text: "green.900",
    },
    connecting: {
        label: "Подключение…",
        hint: "Идёт подключение",
        bg: "yellow.50",
        border: "yellow.200",
        dot: "yellow.400",
        text: "yellow.900",
    },
    error: {
        label: "Ошибка",
        hint: "Ошибка соединения",
        bg: "red.50",
        border: "red.200",
        dot: "red.400",
        text: "red.900",
    },
    closed: {
        label: "Отключено",
        hint: "Соединение закрыто",
        bg: "gray.50",
        border: "gray.200",
        dot: "gray.400",
        text: "gray.800",
    },
    idle: {
        label: "Ожидание",
        hint: "Ожидание подключения",
        bg: "gray.50",
        border: "gray.200",
        dot: "gray.300",
        text: "gray.700",
    },
};

function getStatusView(status: WebSocketConnectionStatus): StatusView {
    return STATUS_STYLES[status] || STATUS_STYLES.idle;
}

function StatusDot({ color }: { color: string }) {
    return (
        <Box
            w="10px"
            h="10px"
            rounded="full"
            bg={color}
            boxShadow="inset 0 0 0 1px rgba(0,0,0,0.08)"
            flex="0 0 10px"
        />
    );
}

export default function StatusHeader({ status }: { status: WebSocketConnectionStatus }) {
    const view = getStatusView(status);

    return (
        <Box
            bg={view.bg}
            borderBottom="1px solid"
            borderColor={view.border}
            px={3}
            py={2}
        >
            <HStack gap={2} align="center" justify="space-between">
                <HStack gap={2} minW={0}>
                    <StatusDot color={view.dot} />
                    <Text fontWeight="semibold" color={view.text}>
                        {view.label}
                    </Text>
                </HStack>
                <Text
                    fontSize="sm"
                    color="blackAlpha.700"
                    aria-live="polite"
                >
                    {view.hint}
                </Text>
            </HStack>
        </Box>
    );
}
