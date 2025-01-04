import { useCallback, useState } from 'react'
import {
    Swap,
    SwapAmountInput,
    SwapToggleButton,
    SwapButton,
    SwapMessage,

} from '@coinbase/onchainkit/esm/swap'
import { useAccount, useSendTransaction } from 'wagmi'
import type {
    BuildSwapTransaction
} from '@coinbase/onchainkit/esm/swap'
import type { Token } from '@coinbase/onchainkit/esm/token'
import { tokenAddress } from './components/CreateBetModal/placeBet'

export default function SwapComponents({ onClose }) {
    const { address } = useAccount()
    const { sendTransaction } = useSendTransaction()

    const ETHToken: Token = {
        address: "",
        chainId: 8453,
        decimals: 18,
        name: "Ethereum",
        symbol: "ETH",
        image: null,
    }

    const DCRToken: Token = {
        address: tokenAddress,
        chainId: 8453,
        decimals: 18,
        name: "DCR",
        symbol: "DCR",
        image: 'https://dcr.bet/favicon.png'
    }

    const swappableTokens: Token[] = [
        // ETHToken,
        DCRToken,
    ]

    const [disabled, setDisabled] = useState(false)

    const onSubmit = useCallback((swapTransaction: BuildSwapTransaction) => {
        const { transaction } = swapTransaction
        console.log('Prepared swapTransaction:', transaction)
        // Transaction submission sample code
        const result = sendTransaction({
            to: transaction.to,
            value: transaction.value,
            data: transaction.data,
            gas: transaction.gas,
            //@ts-ignore
            onSuccess() {
                console.log('done')
                onClose()
            },
            onError(error) {
                console.log('error', error)
            }
        })
    }, [sendTransaction])

    return address ? (
        <div className='relative'>
            {/* {disabled && <div className='absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 z-10 rounded-xl'></div>} */}
            <Swap title='' experimental={{ useAggregator: false, maxSlippage: 6 }} className='text-black bg-slate-100'>
                <SwapAmountInput
                    label="Sell"
                    swappableTokens={swappableTokens}
                    token={ETHToken}
                    type="from"
                />
                <SwapToggleButton />
                <SwapAmountInput
                    label="Buy"
                    swappableTokens={swappableTokens}
                    token={DCRToken}
                    type="to"
                />
                {/* <SwapButton disabled={disabled} className='bg-[#90cdf4]' onSuccess={() => {
                    onClose()
                }} /> */}
                <SwapButton disabled={disabled} />
                <SwapMessage />
            </Swap>
            {/* <iframe
                src="https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=eth&outputCurrency=0x0711ed8b4d1eb1a935cdcc376a205c7dca584457"
                height="660px"
                width="100%"
                style={{
                    border: 0,
                    margin: '0 auto',
                    marginBottom: '.5rem',
                    display: 'block',
                    borderRadius: 10,
                    maxWidth: 960,
                    minWidth: 300,
                }}
            ></iframe> */}
        </div >
    ) : (
        <div>Connect Wallet First!</div>
    )
}
