import { ethers } from 'ethers'
import { CA_ADDRESS, abiJson } from './graphql/contract'
import { base, baseSepolia } from 'viem/chains'
import { captureError } from './sentry'
import { ClientRequestInterceptor } from '@mswjs/interceptors/ClientRequest'

const interceptor = new ClientRequestInterceptor()

// // Enable the interception of requests.
interceptor.apply()

const USING_HTTP = false

let req = 0
let timeouts = []
interceptor.on('request', ({ request, requestId }) => {
    if (request.url.includes('api.telegram.org')) return
    if (!USING_HTTP) return
    // console.log(request.method, request.url, request.body)
    // req++
    timeouts.forEach(clearTimeout)
    timeouts = []
    timeouts.push(
        setTimeout(() => {
            console.warn('[warning] No requests for 10 seconds')
        }, 10_000)
    )
    timeouts.push(
        setTimeout(() => {
            console.error('[error] No requests for 30 seconds, restarting server')
            process.exit(0)
        }, 30_000)
    )
})

// setInterval(() => {
//     console.log('req', req)
//     req = 0
// }, 1000)

const TESTNET = process.env.TESTNET === 'true'
const network = TESTNET ? baseSepolia : base

console.log('running on', network.name)

export const provider = new ethers.WebSocketProvider(
    TESTNET ?
        'https://rpc.ankr.com/base_sepolia/9a90609a5464f26cd5387af736d1227f130676caf045a92f381e4004abb2f470' :
        'wss://base-mainnet.core.chainstack.com/41a3a86752aa0b1cb6eae898af38dfd4',
    // base sepolia
    network.id,
)

provider.on('error', (error) => {
    console.log('provider error', error)
    captureError(error)
})

export const contract = new ethers.Contract(CA_ADDRESS, abiJson.abi, provider)
