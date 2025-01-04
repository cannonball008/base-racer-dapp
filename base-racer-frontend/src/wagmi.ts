import {createConfig, http, webSocket} from 'wagmi'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { coinbaseWallet } from 'wagmi/connectors'
import { QueryClient } from '@tanstack/react-query'
import { isTestnet } from './qs'
import {walletConnect} from "@wagmi/connectors";
import {base, baseSepolia} from "viem/chains";


const projectId = '1fd6b6618c3133160148a7921c483f13'

export const chain = isTestnet ? baseSepolia : base


export const config = createConfig({
    chains: [chain],
    transports: {
        [base.id]: webSocket('wss://base-rpc.publicnode.com'),
        [baseSepolia.id]: webSocket(),
    },
    connectors: [
        walletConnect({
            projectId: projectId,
        }),
        coinbaseWallet({
            appName: 'Create Wagmi',
            chainId: chain.id,
            preference: 'all'
        })
    ],
})

export const queryClient = new QueryClient()

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}


// console.log(config.connectors)
const haveMetamask = config.connectors.some(connector => connector.name === 'MetaMask')

export const createModal = () => {
    createWeb3Modal({
        wagmiConfig: config,
        projectId
    })
}

