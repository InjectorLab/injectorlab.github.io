export type WebSocketConnectionStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

export type OutgoingJsonMessage = Record<string, unknown>;
export type IncomingJsonMessage = Record<string, unknown>;

export const WebSocketErrorCode = {
    CONNECTION_ERROR: 'CONNECTION_ERROR',
    WEBSOCKET_ERROR: 'WEBSOCKET_ERROR',
    SEND_WHEN_CLOSED: 'SEND_WHEN_CLOSED',
    PARSE_ERROR: 'PARSE_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type WebSocketErrorCode = typeof WebSocketErrorCode[keyof typeof WebSocketErrorCode];

export type WebSocketError = {
    code: WebSocketErrorCode;
    message: string;
    cause?: unknown;
    details?: Record<string, unknown>;
};

type StatusListener = (status: WebSocketConnectionStatus) => void;
type MessageListener = (message: IncomingJsonMessage) => void;
type ErrorListener = (error: WebSocketError) => void;

export class WebSocketClient {
    private socket: WebSocket | null = null;

    private status: WebSocketConnectionStatus = 'idle';

    private statusListeners = new Set<StatusListener>();
    private messageListeners = new Set<MessageListener>();
    private errorListeners = new Set<ErrorListener>();

    private setStatus(next: WebSocketConnectionStatus) {
        if (this.status !== next) {
            this.status = next;
            this.emitStatus(next);
        }
    }

    connect(serverUrl: string) {
        this.setStatus('connecting');

        try {
            const socket = new WebSocket(serverUrl);
            socket.binaryType = 'arraybuffer';

            socket.onopen = () => {
                this.socket = socket;
                this.setStatus('open');
            };

            socket.onmessage = (event) => {
                if (typeof event.data === 'string') {
                    try {
                        const parsed = JSON.parse(event.data) as IncomingJsonMessage;
                        this.messageListeners.forEach((listener) => listener(parsed));
                    } catch (cause) {
                        this.emitError({
                            code: WebSocketErrorCode.PARSE_ERROR,
                            message: 'Failed to parse incoming message as JSON',
                            cause,
                            details: {
                                length: event.data.length,
                                preview: event.data.slice(0, 256),
                            },
                        });
                    }
                } else {

                }
            };

            socket.onerror = (event) => {
                this.emitError({
                    code: WebSocketErrorCode.WEBSOCKET_ERROR,
                    message: 'WebSocket reported an error event',
                    cause: event,
                });
                this.setStatus('error');
            };

            socket.onclose = () => {
                this.socket = null;
                if (this.status === 'open') {
                    this.setStatus('closed');
                }
            };
        } catch (cause: any) {
            this.emitError({
                code: WebSocketErrorCode.CONNECTION_ERROR,
                message: cause?.message || 'Failed to initiate WebSocket connection',
                cause,
            });
            this.setStatus('error');
        }
    }

    disconnect() {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            this.socket.close();
        } else {
            this.setStatus('closed');
        }
        this.socket = null;
    }

    send(message: OutgoingJsonMessage) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            try {
                this.socket.send(JSON.stringify(message));
            } catch (cause) {
                this.emitError({
                    code: WebSocketErrorCode.UNKNOWN_ERROR,
                    message: 'Failed to send message via WebSocket',
                    cause,
                });
            }
        } else {
            this.emitError({
                code: WebSocketErrorCode.SEND_WHEN_CLOSED,
                message: 'Attempted to send while socket is not open',
                details: { readyState: this.socket?.readyState ?? 'NO_SOCKET' },
            });
        }
    }

    isOpen(): boolean {
        return this.socket?.readyState === WebSocket.OPEN;
    }

    onStatus(listener: StatusListener) {
        this.statusListeners.add(listener);
        return () => this.statusListeners.delete(listener);
    }

    onMessage(listener: MessageListener) {
        this.messageListeners.add(listener);
        return () => this.messageListeners.delete(listener);
    }

    onError(listener: ErrorListener) {
        this.errorListeners.add(listener);
        return () => this.errorListeners.delete(listener);
    }

    private emitStatus(status: WebSocketConnectionStatus) {
        this.statusListeners.forEach((listener) => listener(status));
    }

    private emitError(error: WebSocketError) {
        this.errorListeners.forEach((listener) => listener(error));
    }
}