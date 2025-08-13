const STORAGE_KEY_WEBSOCKET_ADDRESS = 'websocket_address';

export const WebSocketAddressRepository = {
    load(): string {
        return (
            localStorage.getItem(STORAGE_KEY_WEBSOCKET_ADDRESS) ||
            (import.meta.env.VITE_WS_ADDRESS as string) ||
            ''
        );
    },

    save(address: string) {
        localStorage.setItem(STORAGE_KEY_WEBSOCKET_ADDRESS, address);
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY_WEBSOCKET_ADDRESS);
    },
};