import { RouterProvider, createBrowserRouter, redirect, useLocation } from 'react-router-dom'
import RouterView from './RouterView'
import ErrorPageProviderRouter from './ErrorPageProviderRouter'
import Dashboard from './pages/Dashboard'
import FormEditor from './pages/FormEditor'
import Upload from './pages/Upload'
import Bets from './pages/Bets'
import Finish from './pages/Finish'

const router = createBrowserRouter([
    {
        path: '/',
        Component: RouterView,
        ErrorBoundary: ErrorPageProviderRouter,
        children: [
            {
                path: '/',
                Component: Dashboard,
            },
            {
                path: '/contestants/',
                Component: Dashboard,
            },
            {
                path: '/contestant/',
                Component: FormEditor,
            },
            {
                path: '/contestant/:id',
                Component: FormEditor,
            },
            {
                path: '/race/',
                Component: FormEditor,
            },
            {
                path: '/race/:id',
                Component: FormEditor,
            },
            {
                path: '/file/',
                Component: Upload,
            },
            {
                path: '/bets/:raceId',
                Component: Bets,
            },
            {
                path: '/finish/:raceId',
                Component: Finish,
            },
            {
                path: './*',
                Component: () => <div>404</div>,
            },
            // fix react router
        ].map(x => {
            return {
                ...x,
                Component() {
                    const location = useLocation()
                    return <x.Component key={location.pathname} />
                },
            }
        }),
    },
])

export default () => {
    return <RouterProvider router={router} />
}
