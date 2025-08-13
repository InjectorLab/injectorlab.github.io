import {Editable, Text, Input} from "@chakra-ui/react";
import {LuPencilLine} from "react-icons/lu";
import {useCallback, useEffect, useMemo, useState} from "react";

type EditableNumberProps = {
    value?: any;
    unit?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onSubmit?: (next: number) => void;
};

function sanitizeInt(raw: string) {
    return raw.replace(/(?!^-)[^0-9]/g, "");
}

function toInt(values: string) {
    if (!values) return {
        NaN
    };
    const number = parseInt(values, 10);
    return Number.isFinite(number) ? number : NaN;
}

function clamp(value: number, min?: number, max?: number) {
    if (min != null && value < min) return min;
    if (max != null && value > max) return max;
    return value;
}

export default function EditableNumber({
                                           value, unit, min, max, onSubmit, step = 1, disabled
                                       }: EditableNumberProps) {
    const initial = useMemo(
        () => (value == null || Number.isNaN(value) ? "" : String(Math.trunc(value))),
        [value]
    );
    const [text, setText] = useState(initial);

    useEffect(() => {
        setText(value == null || Number.isNaN(value) ? "" : String(Math.trunc(value)));
    }, [value]);

    const handleChange = ({value}: any) => {
        setText(sanitizeInt(value));
    }

    const commit = useCallback(() => {
        const parsed = toInt(text);
        if (!Number.isFinite(parsed)) {
            return;
        }
        const normalized = clamp(parsed as number, min, max);
        onSubmit?.(normalized);
    }, [text, min, max, onSubmit]);

    const cancel = () => {
        setText(initial);
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            commit();
            return;
        };
        if (e.key === "Escape") {
            cancel();
            return;
        };
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            let current = toInt(text);
            if (!Number.isFinite(current)) {
                current = 0;
            }
            const delta = e.key === "ArrowUp" ? step : -step;

            setText(String(clamp(current + delta as number, min, max)));
        }
    };

    return (
        <Editable.Root value={text} onValueChange={handleChange} justifyContent="flex-end" disabled={disabled}>
            {!disabled && (
                <Editable.Control>
                    <Editable.EditTrigger asChild>
                        <LuPencilLine />
                    </Editable.EditTrigger>
                </Editable.Control>
            )}
            <Editable.Preview asChild>
                <Text padding="0">{text ? `${text}${unit ? ` ${unit}` : ""}` : "—"}</Text>
            </Editable.Preview>
            <Editable.Input
                as={Input}
                inputMode="numeric"
                onKeyDown={onKeyDown}
            />
        </Editable.Root>
    )
}