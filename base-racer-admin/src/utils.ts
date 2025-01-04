import { useMedia } from 'react-use'
import * as ethers from 'ethers'

export const SMALL_SCREEN_MEDIA = '@media (max-width: 716px)' as const

export const useIsMobile = () => {
    return useMedia(SMALL_SCREEN_MEDIA.replace('@media ', ''))
}
export const clampAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

export const getProvider = () => {
    //@ts-expect-error
    const provider = new ethers.BrowserProvider(window.ethereum)
    return provider
}

export const getProviderFromPrivateKey = (privateKey: string) => {
    const provider = new ethers.Wallet(privateKey).connect(getProvider())
    return provider
}

export const getSigner = async () => {
    const provider = getProvider()
    return provider.getSigner()
}

export const filterEmptyRows = (data: any[], excludeProps = [] as string[]) => {
    return data.filter(d => {
        return Object.entries(d).some(([k, v]) => {
            if (excludeProps.includes(k)) return false
            return typeof v === 'string' ? !!v : typeof v === 'number' ? !!v : Array.isArray(v) ? v.length > 0 : !!v
        })
    })
}
