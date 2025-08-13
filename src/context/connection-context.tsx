import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
    WebSocketClient,
    type WebSocketConnectionStatus,
    type OutgoingJsonMessage,
    type IncomingJsonMessage,
    type WebSocketError,
} from './ws/ws-client';
import {WebSocketAddressRepository} from './ws/ws-repository';

const WS_PROTOCOL = (import.meta.env.VITE_WS_PROTOCOL as string) ?? 'ws://'
const WS_PATH = (import.meta.env.VITE_WS_PATH as string) ?? '/ws'

export type MessageCallback = (message: IncomingJsonMessage) => void
export type ErrorCallback = (error: WebSocketError) => void

type ConnectionContextValue = {
    status: WebSocketConnectionStatus
    address: string
    connect: (address: string) => void
    disconnect: () => void
    send: (message: OutgoingJsonMessage) => void
    onMessage: (callback: MessageCallback) => () => void
    onError: (callback: ErrorCallback) => () => void
}

const ConnectionContext = createContext<ConnectionContextValue | undefined>(undefined)

export function ConnectionProvider({children}: { children: React.ReactNode }) {
    const {current: client} = useRef(new WebSocketClient());
    const [status, setStatus] = useState<WebSocketConnectionStatus>('idle');
    const [address, setAddress] = useState<string>(
        WebSocketAddressRepository.load()
    );

    useEffect(() => {
        const unsubscribeStatus = client.onStatus((newStatus) => {
            setStatus(newStatus);
        });
        return () => {
            unsubscribeStatus();
        }
    }, [client]);

    const connect = (newAddress: string) => {
        setAddress(newAddress);
        WebSocketAddressRepository.save(newAddress);
        const url = `${WS_PROTOCOL}${newAddress}${WS_PATH}`;
        client.connect(url);
    };

    const disconnect = () => {
        client.disconnect();
    };

    const send = (message: OutgoingJsonMessage) => {
        client.send(message);
    };

    const onMessage = (callback: MessageCallback) => client.onMessage(callback);
    const onError = (callback: ErrorCallback) => client.onError(callback);

    const contextValue = useMemo<ConnectionContextValue>(
        () => ({
            status,
            address,
            connect,
            disconnect,
            send,
            onMessage,
            onError,
        }),
        [status, address]
    );

    return <ConnectionContext.Provider value={contextValue}>{children}</ConnectionContext.Provider>
}

export function useConnection() {
    const ctx = useContext(ConnectionContext)
    if (!ctx) throw new Error('useConnection must be used within ConnectionProvider')
    return ctx
}