import type {WebSocketConnectionStatus, WebSocketError} from "../../context/ws/ws-client.ts";

import { useConnection } from "../../context/connection-context";
import {useEffect, useRef} from "react";
import { toaster } from "../toaster/toaster";

function titleForError(code: string) {
    switch (code) {
        case "CONNECTION_ERROR": return "Ошибка подключения";
        case "WEBSOCKET_ERROR":  return "Ошибка соединения";
        case "PARSE_ERROR":      return "Ошибка формата данных";
        case "SEND_WHEN_CLOSED": return "Отправка при закрытом сокете";
        default:                 return "Ошибка";
    }
}

export default function ConnectionToasts() {
    const { status, address, onError } = useConnection();
    const prevStatus = useRef<WebSocketConnectionStatus | null>(null);

    useEffect(() => {
        if (prevStatus.current === status) {
            return;
        }
        prevStatus.current = status;

        if (status === "connecting") {
            toaster.create({
                title: "Подключение…",
                description: `Подключаемся к "${address}"`,
                type: "info",
                closable: true,
            });
        } else if (status === "open") {
            toaster.create({
                title: "Подключено",
                description: `Установлено соединение с "${address}"`,
                type: "success",
                closable: true,
            });
        } else if (status === "closed") {
            toaster.create({
                title: "Отключено",
                description: `Соединение разорвано`,
                type: "info",
                closable: true,
            });
        }
    }, [status, address]);

    useEffect(() => {
        return onError((err: WebSocketError) => {
            toaster.create({
                title: titleForError(err.code),
                description: err.message || "Неизвестная ошибка",
                type: "error",
                closable: true,
            });
        });
    }, [onError]);

    return <></>;
}