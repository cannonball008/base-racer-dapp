import { GraphQLClient, gql } from 'graphql-request'
import { proxy, ref } from 'valtio'
// import { getWalletClient, GetContractResult, GetWalletClientResult } from '@wagmi/core'
import { GetContractReturnType, getContract } from 'viem'
import { UseWalletClientReturnType } from 'wagmi'
import { isTestnet } from '../qs'
import { watchContractEvent } from '@wagmi/core'
import { config } from '../wagmi'
import { toastState } from '../GlobalToast'

export const contractState = proxy({
    address: '',
    abi: [],
    contract: null as (GetContractReturnType<any, any, any> & { on, write, watchEvent }) | null
})

export const waitForEvent = (eventName: string, argsCompare) => {
    return new Promise((resolve) => {
        contractState.contract!.watchEvent[eventName]({}, {
            onLogs: (logs) => {
                const deepCompare = (objSource, objTarget) => {
                    for (const [key, value] of Object.entries(objSource)) {
                        if (typeof value === 'object' && value) {
                            if (!deepCompare(value, objTarget[key])) return false
                        }
                        else if (typeof value === 'string' && value.startsWith('0x') && value.toLowerCase() !== objTarget[key].toLowerCase()) return false
                        else if (value !== objTarget[key]) return false
                    }
                    return true
                }
                if (!deepCompare(argsCompare, logs[0].args)) return
                resolve(logs)
            }
        })
    })
}

export const loadContract = async (client: NonNullable<UseWalletClientReturnType>['data']) => {
    const document = gql`
        query Contract {
            contract {
                address
                abi
            }
        }
    `
    type Type = {
        contract: {
            address: string
            abi: string
        }
    }
    const data = await new GraphQLClient(import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://api.dcr.bet/').request<Type>(document, {})
    if (isTestnet) {
        data.contract.address = '0xa74C7515d81F1448f442cc9519a6db5b146444E5'
    }
    const address = data.contract.address
    contractState.address = address
    const abi = JSON.parse(data.contract.abi)
    contractState.abi = abi

    // const client = (await getWalletClient())!
    const contract = getContract({
        abi,
        address: address as any,
        client: client,
        walletClient: client,
        publicClient: client,
    } as any) as any
    globalThis.contract = contract
    let errorReported = false
    console.log("Initialize contract")
    contract.on = (eventName, fn) => {
        watchContractEvent(config, {
            abi: contractState.abi,
            address: contractState.address as any,
            eventName: eventName,
            onLogs: (event) => {
                fn(event)
            },
            onError(error) {
                console.error(`Error while listening to event ${eventName}`, error)
                if (!errorReported) {
                    toastState.message = 'Error while listening to events, check your connection / RPC provider'
                }
                errorReported = true
            },
        })
    }
    contractState.contract = ref(contract) as any
}

export const getProvider = () => {
    //@ts-expect-error
    const provider = new ethers.BrowserProvider(window.ethereum)
    return provider
}
