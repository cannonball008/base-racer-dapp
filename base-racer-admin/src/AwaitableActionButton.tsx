import { Tooltip, Spinner } from '@nextui-org/react'
import { useAwaitedClickAction } from '@zardoy/react-util'

export const AwaitableActionButton = ({ label, danger = false, onClick, disabled = false, children }) => {
    const awaitedClickAction = useAwaitedClickAction(onClick, disabled)

    return (
        <Tooltip content={label} color={danger ? 'danger' : undefined}>
            <span
                className={`${danger ? 'text-danger' : ''} text-lg cursor-pointer active:opacity-50 ${awaitedClickAction.disabled ? 'opacity-20' : ''}`}
                {...awaitedClickAction}
            >
                {!disabled && awaitedClickAction.disabled ? <Spinner size="sm" /> : children}
            </span>
        </Tooltip>
    )
}
