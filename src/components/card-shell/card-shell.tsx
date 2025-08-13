import React from "react";
import { Box } from "@chakra-ui/react";

export default function CardShell(props: { children?: React.ReactNode }) {
    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="blackAlpha.200"
            rounded="xl"
            boxShadow="sm"
            p={3}
            overflow="hidden"
        >
            {props.children}
        </Box>
    );
}
