import { Abi, AbiEvents, ContestantsResponse } from './abi'
import { filterEmptyRows, getProvider, getSigner } from './utils'
import * as ethers from 'ethers'
import { MulticallWrapper } from 'ethers-multicall-provider'
import { GraphQLClient, gql } from 'graphql-request'
import { IS_TESTNET } from './wagmi'

const getContractData = async () => {
    const document = gql`
        query {
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
    try {
        const data = await new GraphQLClient(import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://api.dcr.bet/').request<Type>(document, {})
        localStorage.lastContractData = JSON.stringify(data)
        return data
    } catch (err) {
        if (localStorage.lastContractData) {
            console.error(err)
            console.warn('Using last saved contract data')
            return JSON.parse(localStorage.lastContractData)
        }
        throw err
    }
}

export const getContract = async () => {
    const provider = MulticallWrapper.wrap(getProvider())
    const signer = await provider.getSigner()

    const data = await getContractData()
    const contractAddress = IS_TESTNET ? '0xa74C7515d81F1448f442cc9519a6db5b146444E5' : data.contract.address
    const _contract = new ethers.Contract(contractAddress, JSON.parse(data.contract.abi), signer)
    const contract = _contract as typeof _contract &
        Abi & {
            on(event: AbiEvents, listener: (...args: any) => void)
        }
    //@ts-ignore
    window.contract = contract
    // check owner
    const owner = await contract.admins(signer.address)
    if (!owner) {
        throw new Error('Access denied')
    }
    return new Proxy(contract as typeof contract, {
        get: (target, prop) => {
            if (typeof prop === 'symbol') return Reflect.get(target, prop)
            if (prop in contract && contract.interface.getFunction(prop)?.type === 'function') {
                const methodOutputs = contract.interface.getFunction(prop)?.outputs ?? []
                return async (...args) => {
                    console.log(`calling ${prop}(${args.map(a => JSON.stringify(a)).join(', ')})`)
                    const result = await contract[prop]!(...args)
                    if (result.wait) {
                        console.log('awaiting', prop)
                        return result.wait()
                    }
                    if (methodOutputs[0]?.name !== '') {
                        const names = methodOutputs.map(o => o.name)
                        const obj = {}
                        for (const name of names) {
                            obj[name] = typeof result[name] === 'bigint' ? Number(result[name]) : result[name]
                        }
                        return obj
                    }
                    return result
                }
            } else {
                return Reflect.get(target, prop)
            }
        },
    })
}

type ContractType = Awaited<ReturnType<typeof getContract>> & Abi

export const getContestants = async (contract: ContractType) => {
    const maxContestantId = await contract.currentContestantId()
    console.log('maxContestantId', maxContestantId)
    const contestants: ContestantsResponse[] = await Promise.all(Array.from({ length: Number(maxContestantId) }, (_, i) => contract.contestants(i + 1)))
    return filterEmptyRows(contestants)
}
