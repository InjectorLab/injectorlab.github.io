import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import {ChakraProvider, defaultSystem} from '@chakra-ui/react'
import {ConnectionProvider} from "./context/connection-context.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ChakraProvider value={defaultSystem}>
            <ConnectionProvider>
                <App />
            </ConnectionProvider>
        </ChakraProvider>
    </StrictMode>,
)
