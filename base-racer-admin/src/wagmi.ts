import { base, baseSepolia } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

export const IS_TESTNET = false

export const chain = IS_TESTNET ? baseSepolia : base

const projectId = '465355f7ea0b1d8cc2c1be32776ee23c'

export const config = defaultWagmiConfig({
    projectId,
    chains: [chain],
    metadata: {
        name: 'DCR Admin',
        // description: import.meta.env.VITE_DESCRIPTION,
        url: 'https://web3modal.com',
        // icons: ['https://avatars.githubusercontent.com/u/37784886']
    },
})

// console.log(config.connectors)
const haveMetamask = config.connectors.some(connector => connector.name === 'MetaMask')

export const createModal = () => {
    const web3Modal = createWeb3Modal({
        wagmiConfig: config,
        projectId,
        customWallets: haveMetamask
            ? []
            : [
                  {
                      id: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
                      name: 'MetaMask',
                      homepage: 'https://metamask.io/',
                      image_url: metamaskImageData,
                      order: 10,
                      mobile_link: 'metamask://',
                      desktop_link: null,
                      webapp_link: null,
                      app_store: 'https://apps.apple.com/us/app/metamask/id1438144202',
                      play_store: 'https://play.google.com/store/apps/details?id=io.metamask',
                      rdns: 'io.metamask',
                      chrome_store: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
                      injected: [
                          {
                              namespace: 'eip155',
                              injected_id: 'isMetaMask',
                          },
                      ],
                  } as any,
              ],
        chains: [chain],
        connectorImages: {
            metaMask: metamaskImageData,
        },
    })
}

const metamaskImageData = `data:image/svg+xml,%3Csvg data-v-e1ee1034='' data-v-701ac82d-s='' height='355' viewBox='0 0 397 355' width='397' xmlns='http://www.w3.org/2000/svg' class='logo'%3E%3Cg fill='none' fill-rule='evenodd' transform='translate(-1 -1)'%3E%3Cpath d='m114.622644 327.195472 52.004717 13.810198v-18.05949l4.245283-4.249292h29.716982v21.246459 14.872523h-31.839624l-39.268868-16.997169z' fill='%23cdbdb2'%3E%3C/path%3E%3Cpath d='m199.528305 327.195472 50.943397 13.810198v-18.05949l4.245283-4.249292h29.716981v21.246459 14.872523h-31.839623l-39.268868-16.997169z' fill='%23cdbdb2' transform='matrix(-1 0 0 1 483.96227 0)'%3E%3C/path%3E%3Cpath d='m170.872644 287.889523-4.245283 35.056657 5.306604-4.249292h55.18868l6.367925 4.249292-4.245284-35.056657-8.490565-5.311615-42.452832 1.062323z' fill='%23393939'%3E%3C/path%3E%3Cpath d='m142.216984 50.9915022 25.471698 59.4900858 11.674528 173.158643h41.391511l12.735849-173.158643 23.349056-59.4900858z' fill='%23f89c35'%3E%3C/path%3E%3Cpath d='m30.7783023 181.657226-29.71698153 86.048161 74.29245393-4.249293h47.7594343v-37.181303l-2.122641-76.487253-10.613208 8.498583z' fill='%23f89d35'%3E%3C/path%3E%3Cpath d='m87.0283032 191.218134 87.0283028 2.124646-9.551886 44.617563-41.391511-10.623229z' fill='%23d87c30'%3E%3C/path%3E%3Cpath d='m87.0283032 192.280457 36.0849058 33.994334v33.994334z' fill='%23ea8d3a'%3E%3C/path%3E%3Cpath d='m123.113209 227.337114 42.452831 10.623229 13.79717 45.679888-9.551886 5.311615-46.698115-27.620398z' fill='%23f89d35'%3E%3C/path%3E%3Cpath d='m123.113209 261.331448-8.490565 65.864024 56.25-39.305949z' fill='%23eb8f35'%3E%3C/path%3E%3Cpath d='m174.056606 193.34278 5.306604 90.297451-15.919812-46.211049z' fill='%23ea8e3a'%3E%3C/path%3E%3Cpath d='m74.2924539 262.393771 48.8207551-1.062323-8.490565 65.864024z' fill='%23d87c30'%3E%3C/path%3E%3Cpath d='m24.4103777 355.878193 90.2122663-28.682721-40.3301901-64.801701-73.23113313 5.311616z' fill='%23eb8f35'%3E%3C/path%3E%3Cpath d='m167.688682 110.481588-45.636793 38.243627-35.0235858 42.492919 87.0283028 3.186969z' fill='%23e8821e'%3E%3C/path%3E%3Cpath d='m114.622644 327.195472 56.25-39.305949-4.245283 33.994334v19.121813l-38.207548-7.43626z' fill='%23dfcec3'%3E%3C/path%3E%3Cpath d='m229.245286 327.195472 55.18868-39.305949-4.245283 33.994334v19.121813l-38.207548-7.43626z' fill='%23dfcec3' transform='matrix(-1 0 0 1 513.679252 0)'%3E%3C/path%3E%3Cpath d='m132.665096 212.464593-11.674528 24.433427 41.39151-10.623229z' fill='%23393939' transform='matrix(-1 0 0 1 283.372646 0)'%3E%3C/path%3E%3Cpath d='m23.349057 1.06232296 144.339625 109.41926504-24.410378-59.4900858z' fill='%23e88f35'%3E%3C/path%3E%3Cpath d='m23.349057 1.06232296-19.10377392 58.42776294 10.61320772 63.7393781-7.42924541 4.249292 10.61320771 9.560906-8.49056617 7.436261 11.67452847 10.623229-7.4292454 6.373938 16.9811323 21.246459 79.5990577-24.433428c38.915096-31.161473 58.018869-47.096318 57.311322-47.804533-.707548-.708215-48.820756-37.1813036-144.339625-109.41926504z' fill='%238e5a30'%3E%3C/path%3E%3Cg transform='matrix(-1 0 0 1 399.056611 0)'%3E%3Cpath d='m30.7783023 181.657226-29.71698153 86.048161 74.29245393-4.249293h47.7594343v-37.181303l-2.122641-76.487253-10.613208 8.498583z' fill='%23f89d35'%3E%3C/path%3E%3Cpath d='m87.0283032 191.218134 87.0283028 2.124646-9.551886 44.617563-41.391511-10.623229z' fill='%23d87c30'%3E%3C/path%3E%3Cpath d='m87.0283032 192.280457 36.0849058 33.994334v33.994334z' fill='%23ea8d3a'%3E%3C/path%3E%3Cpath d='m123.113209 227.337114 42.452831 10.623229 13.79717 45.679888-9.551886 5.311615-46.698115-27.620398z' fill='%23f89d35'%3E%3C/path%3E%3Cpath d='m123.113209 261.331448-8.490565 65.864024 55.18868-38.243626z' fill='%23eb8f35'%3E%3C/path%3E%3Cpath d='m174.056606 193.34278 5.306604 90.297451-15.919812-46.211049z' fill='%23ea8e3a'%3E%3C/path%3E%3Cpath d='m74.2924539 262.393771 48.8207551-1.062323-8.490565 65.864024z' fill='%23d87c30'%3E%3C/path%3E%3Cpath d='m24.4103777 355.878193 90.2122663-28.682721-40.3301901-64.801701-73.23113313 5.311616z' fill='%23eb8f35'%3E%3C/path%3E%3Cpath d='m167.688682 110.481588-45.636793 38.243627-35.0235858 42.492919 87.0283028 3.186969z' fill='%23e8821e'%3E%3C/path%3E%3Cpath d='m132.665096 212.464593-11.674528 24.433427 41.39151-10.623229z' fill='%23393939' transform='matrix(-1 0 0 1 283.372646 0)'%3E%3C/path%3E%3Cpath d='m23.349057 1.06232296 144.339625 109.41926504-24.410378-59.4900858z' fill='%23e88f35'%3E%3C/path%3E%3Cpath d='m23.349057 1.06232296-19.10377392 58.42776294 10.61320772 63.7393781-7.42924541 4.249292 10.61320771 9.560906-8.49056617 7.436261 11.67452847 10.623229-7.4292454 6.373938 16.9811323 21.246459 79.5990577-24.433428c38.915096-31.161473 58.018869-47.096318 57.311322-47.804533-.707548-.708215-48.820756-37.1813036-144.339625-109.41926504z' fill='%238e5a30'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E`
