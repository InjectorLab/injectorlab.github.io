import {
    Box,
    Container,
    SimpleGrid
} from "@chakra-ui/react";
import ConnectionCard from "./components/connection-card/connection-card.tsx";
import {useConnection} from "./context/connection-context.tsx";
import {Toaster} from "./components/toaster/toaster.tsx";
import PumpCard from "./components/pump-card/pump-card.tsx";
import InjectorConfigCard from "./components/injector-config-card/injector-config-card.tsx";
import TimerCard from "./components/timer-card/timer-card.tsx";

export default function App() {
    const {status} = useConnection();
    const isConnected = status === "open";

    return (
        <>
            <Box bg="gray.50" minH="100dvh">
                <Container maxW="container.xl" py={4}>
                    <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap={3}>

                        <Box gridColumn={{base: "auto", md: "1 / -1"}}>
                            <ConnectionCard/>
                        </Box>

                        {isConnected && (
                            <>
                                <PumpCard/>
                                <InjectorConfigCard/>
                                <TimerCard/>
                            </>
                        )}
                    </SimpleGrid>
                </Container>
            </Box>
            <Toaster />
        </>
    );
}