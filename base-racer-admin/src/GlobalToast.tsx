import { Close } from '@mui/icons-material'
import { Snippet } from '@nextui-org/react'
import { proxy, useSnapshot } from 'valtio'

export const globalToast = proxy({
    value: '',
    open: false,
})

export default () => {
    const { open, value } = useSnapshot(globalToast)

    return (
        <div className="fixed bottom-[20px] right-[20px] z-[100]">
            {open && (
                <Snippet
                    color="danger"
                    symbol="⚠️"
                    tooltipProps={{
                        content: 'Close',
                    }}
                    copyButtonProps={{
                        onPress() {
                            globalToast.open = false
                        },
                    }}
                    copyIcon={<Close />}
                    classNames={{
                        pre: 'whitespace-pre-line',
                    }}
                    style={{
                        backgroundColor: 'white',
                    }}
                >
                    {value}
                </Snippet>
            )}
        </div>
    )
}
