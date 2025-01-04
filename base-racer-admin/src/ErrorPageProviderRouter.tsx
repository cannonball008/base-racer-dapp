import { useRouteError } from 'react-router-dom'
import ErrorDisplay from './ErrorDisplay'

export default () => {
    const error = useRouteError() as any
    console.error(error)

    return <ErrorDisplay>{error.statusText || error.message}</ErrorDisplay>
}
