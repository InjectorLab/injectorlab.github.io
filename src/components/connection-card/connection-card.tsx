import { Box } from "@chakra-ui/react";
import { useConnection } from "../../context/connection-context.tsx";
import StatusHeader from "../../components/connection-card/connection-status.tsx";
import ConnectionControl from "../../components/connection-card/connection-control.tsx";
import ConnectionToasts from "../../components/connection-card/connection-toast.tsx";

export default function ConnectionCard() {
    const { status } = useConnection();

    return (
        <Box
            gridColumn={{ base: "auto", md: "1 / -1" }}
            bg="white"
            border="1px solid"
            borderColor="blackAlpha.200"
            rounded="xl"
            boxShadow="sm"
            p={0}
            overflow="hidden"
        >
            <StatusHeader status={status} />
            <ConnectionControl />
            <ConnectionToasts />
        </Box>
    );
}