import { ethers } from 'ethers'
import { contractState } from '../../pages/contract'
import { getContract } from 'viem'
import { UseWalletClientReturnType } from 'wagmi'
import { isTestnet } from '../../qs'
import { waitForTransactionReceipt } from 'viem/actions'

export const makeBet = async (raceId, playerId, amount, lap = null as any, client: NonNullable<UseWalletClientReturnType['data']>) => {
    const address = client.account!.address
    const erc20Contract = await getTokenContract(client)
    const amountWei = ethers.parseEther(amount.toString())
    const allowance = await erc20Contract.read.allowance([address, contractState.address])
    if (allowance < amountWei) {
        const approveTx = await erc20Contract.write.approve([contractState.address, amountWei])
        await waitForTransactionReceipt(client as any, {
            hash: approveTx,
        })
    }

    const fullRace = lap === null
    console.log('makeBet', raceId, playerId, amountWei, fullRace, lap)
    const hash = await (contractState.contract! as any).write.makeBet([raceId, playerId, amountWei, fullRace, +lap ?? 0])
    await waitForTransactionReceipt(client as any, {
        hash,
    })
}

export const tokenAddress = isTestnet ? '0x30a7F3F76E922D0a9A60Ab459d4e59C73a8B020b' : '0x0711ed8b4d1eb1a935cdcc376a205c7dca584457'
export const getTokenContract = async (client) => {
    const erc20Contract = getContract({
        abi: [{
            "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }],
            "name": "allowance",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            type: 'function',
            stateMutability: 'view',
        }, {
            "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }],
            "name": "approve",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
            type: 'function',
            stateMutability: 'nonpayable',
        }, {
            "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            type: 'function',
            stateMutability: 'view',
        }],
        address: tokenAddress,
        client: client,
        walletClient: client,
        // publicClient: client,
    } as any)
    return erc20Contract as any
}
