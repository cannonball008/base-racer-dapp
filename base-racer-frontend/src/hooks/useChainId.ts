import { useEffect, useState } from 'react'
import { useChainId, useWalletClient } from 'wagmi'
// import { watchNetwork } from '@wagmi/core'
import { chain } from '../wagmi'

export default () => {
    const _chainId = useChainId()
    const [chainId, setChainId] = useState<number | null>(_chainId)
    const { data } = useWalletClient()

    useEffect(() => {
        setChainId(data?.chain.id ?? null)
        // watchNetwork(({ chain }) => {
        //     if (chain?.id) {
        //         setChainId(chain.id)
        //     }
        // })
    }, [])

    return {
        chainId,
        supportedName: chain.name,
        unsupported: chainId && /* chainId !== 8453 &&  */chainId !== chain.id,
        etherscan: 'basescan.org',
    }
}
