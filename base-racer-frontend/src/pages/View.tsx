import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { loadContract } from './contract'
import { Box } from '@chakra-ui/react'
import { useAccount, useWalletClient } from 'wagmi'
import useChainId from '../hooks/useChainId'

export default () => {
    const [loaded, setLoaded] = useState(false)
    const { address, isConnected } = useAccount()
    const { unsupported, supportedName, chainId } = useChainId()
    const { data: client } = useWalletClient()

    useEffect(() => {
        const load = async () => {
            try {
                if (client?.chain) {
                    await loadContract(client)
                }
            } catch (err) {
                console.error(err)
                // setTimeout(() => {
                //     throw err
                // })
            }
            setLoaded(true)
        }
        load()
    }, [address, isConnected, chainId, client])

    // todo button
    if (isConnected && unsupported) return <Box padding={10} fontSize='xx-large'>Unsupported Network. Please Switch to {supportedName}</Box>
    if (!loaded) return <Box padding={10} fontSize='xx-large'>Loading...</Box>

    return <Outlet />
}
