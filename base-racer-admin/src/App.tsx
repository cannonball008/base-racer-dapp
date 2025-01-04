import { ErrorBoundary } from '@zardoy/react-util'
import { WagmiConfig } from 'wagmi'
import { NextUIProvider } from '@nextui-org/react'
import ErrorDisplay from './ErrorDisplay'
import Router from './Router'
import { config } from './wagmi'
import GlobalToast, { globalToast } from './GlobalToast'
import { EthersError } from 'ethers'
import GlobalModal from './GlobalModal'

window.addEventListener('error', e => {
    console.error(e)
    globalToast.value = e.message
    globalToast.open = true
})

window.addEventListener('unhandledrejection', e => {
    const err = e.reason
    let message = err.message
    if ((err as EthersError).info?.error?.message) message = (err as EthersError).info!.error.message
    globalToast.value = message
    globalToast.open = true
})

export default function App() {
    return (
        <ErrorBoundary renderError={err => <ErrorDisplay>{err.message}</ErrorDisplay>}>
            <NextUIProvider>
                <WagmiConfig config={config}>
                    <GlobalToast />
                    <GlobalModal />
                    <Router />
                </WagmiConfig>
            </NextUIProvider>
        </ErrorBoundary>
    )
}
