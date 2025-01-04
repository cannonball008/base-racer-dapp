import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vitePluginSvgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@coinbase/onchainkit/esm/wallet': '@coinbase/onchainkit/wallet',
      '@coinbase/onchainkit/esm/swap': '@coinbase/onchainkit/swap',
      '@coinbase/onchainkit/esm/token': '@coinbase/onchainkit/token',
    },
  },
  plugins: [react(), vitePluginSvgr()]
})
