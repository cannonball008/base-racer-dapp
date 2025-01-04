/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
import { renderToDom } from '@zardoy/react-util'
import App from './App'
import './global.css'
import { createModal } from './wagmi'
import 'tailwindcss/tailwind.css'

createModal()

renderToDom(<App />, {
    strictMode: false,
})

if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => console.clear())
}
