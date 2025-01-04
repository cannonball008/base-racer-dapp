import stylex from '@stylexjs/stylex'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ExitToApp, AccountCircle } from '@mui/icons-material'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useChainId } from 'wagmi'
import { Button } from '@nextui-org/react'
import { clampAddress } from './utils'
import Logo from './Logo.jpeg'
import { useEffect, useState } from 'react'
import { watchNetwork, watchAccount, sepolia } from '@wagmi/core'
import { getContract } from './abi-src'
import { chain } from './wagmi'

const styles = stylex.create({
    root: {
        display: 'flex',
    },
    rootMobile: {
        flexDirection: 'column',
    },
})

export default function Component({ children }: { children?: React.ReactNode }) {
    return <Inner />
}

const upperFirst = (str: string) => str[0]!.toUpperCase() + str.slice(1)

const Inner = () => {
    const { isConnected, address } = useAccount()
    const location = useLocation()

    const menu = [
        {
            label: 'Contestants',
            path: '/contestants',
        },
        {
            label: 'Races',
            path: '/',
        },
    ]

    const [render, setRender] = useState(false)
    const [error, setError] = useState('')
    const _chainId = useChainId()
    const [chainId, setChainId] = useState<number | null>(_chainId)

    useEffect(() => {
        ;(async () => {
            setRender(false)
            if (!address) return
            try {
                if (chainId !== chain.id) {
                    throw new Error(`Invalid network, please switch to ${chain.name}`)
                }
                await getContract()
                setError('')
                setRender(true)
            } catch (e) {
                console.error(e)
                setError(e.message)
            }
        })()
    }, [address, chainId, isConnected])

    useEffect(() => {
        watchNetwork(({ chain }) => {
            if (chain?.id) {
                setChainId(chain.id)
            }
        })
    }, [])

    const connectedRender = isConnected && render
    const altConnectDisplay = !isConnected && !error
    const errorText = error || 'Connect your wallet first!'
    return (
        <div className="flex h-[100dvh]">
            {connectedRender && !error && (
                <div className="py-7 px-10 bg-[#283541] h-full text-white text-large w-[200px]">
                    <h1 className="text-base">Admin Panel</h1>
                    <div className="py-3 mt-10 flex flex-col gap-2">
                        {menu.map(x => {
                            const matches = location.pathname === x.path
                            return (
                                <Link key={x.path} to={`${x.path}`} className={`${matches && 'font-bold'}`}>
                                    {x.label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
            <div className={`flex-1 px-2 sm:px-4 ${connectedRender ? '' : 'flex flex-col items-center'}`}>
                {/* navbar header */}
                <div className="flex justify-between py-4 items-center w-full">
                    <img src={Logo} width={100} />
                    {!altConnectDisplay && <WalletButton />}
                </div>
                {connectedRender ? <Outlet /> : <div className="text-red-500 m-4 text-xl">{errorText}</div>}
                {altConnectDisplay && <WalletButton />}
            </div>
        </div>
    )
}

function WalletButton() {
    const web3Modal = useWeb3Modal()
    const { isConnected, address } = useAccount()

    return (
        <Button onClick={async () => web3Modal.open()}>
            {isConnected ? (
                <>
                    <AccountCircle />
                    {clampAddress(address!)}
                </>
            ) : (
                'Connect'
            )}
        </Button>
    )
}
