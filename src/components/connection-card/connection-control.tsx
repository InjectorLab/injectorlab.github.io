import { useEffect, useState } from "react";
import {Box, Input, Button, Stack} from "@chakra-ui/react";
import { useConnection } from "../../context/connection-context.tsx";

const FALLBACK_ADDRESS = "127.0.0.1";

export default function ConnectionControl() {
    const { status, connect, disconnect, address } = useConnection();
    const [inputAddress, setInputAddress] = useState(FALLBACK_ADDRESS);

    useEffect(() => {
        if(address.length > 0) {
            setInputAddress(address);
        }
    }, []);

    const isConnected = status === "open";
    const isConnecting = status === "connecting";

    const handleConnect = () => {
        const trimmed = inputAddress.trim();
        if (!trimmed) {
            return;
        }
        connect(trimmed);
    };

    return (
        <Box px={3} py={3}>
            <Stack
                direction={{ base: "column", sm: "row" }}
                align="stretch"
                gap={2}
            >
                <Input
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    placeholder="Адрес устройства"
                    spellCheck={false}
                    disabled={isConnecting || isConnected}
                    w="100%"
                    flex="1 1 auto"
                />

                {!isConnected ? (
                    <Button
                        onClick={handleConnect}
                        colorPalette="green"
                        loading={isConnecting}
                        w={{ base: "100%", sm: "auto" }}
                        flexShrink={0}
                    >
                        Подключиться
                    </Button>
                ) : (
                    <Button
                        onClick={disconnect}
                        variant="outline"
                        colorPalette="red"
                        w={{ base: "100%", sm: "auto" }}
                        flexShrink={0}
                    >
                        Отключиться
                    </Button>
                )}
            </Stack>
        </Box>
    );
}