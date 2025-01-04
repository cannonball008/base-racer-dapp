/// <reference types="vite/client" />
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { ChakraProvider } from "@chakra-ui/react"
import "@rainbow-me/rainbowkit/styles.css"
import { QueryClientProvider } from '@tanstack/react-query'
import 'tailwindcss/tailwind.css'

import { WagmiProvider } from "wagmi"
import theme from "./theme/theme.ts"
import { createModal, config, queryClient, chain } from "./wagmi.ts"
import { OnchainKitProvider } from "@coinbase/onchainkit"
import GlobalToast from "./GlobalToast.ts"

createModal()

const rootElement = document.getElementById("root")

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider apiKey="WaycQQ4VTKYZ0lujWi3rdAgSkQUH9yst" chain={chain}>
            <ChakraProvider theme={theme}>
              <App />
              <GlobalToast />
            </ChakraProvider>
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  )
} else {
  console.error("Root element not found")
}