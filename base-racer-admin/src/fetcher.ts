import { GraphQLClient, gql } from 'graphql-request'
import { useEffect, useState } from 'react'

export const useFetch = <T>({ enabled = true, variables = {}, document, stateCounter = 0 }) => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!enabled) return
        ;(async () => {
            setLoading(true)
            const data = await makeRequest<T>({ document, variables })
            setData(data as T)
            setLoading(false)
        })()
    }, [enabled, stateCounter])

    return { data, loading }
}

export const makeRequest = async <T>({ document, variables = {} }) => {
    const data = await new GraphQLClient(import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://api.dcr.bet/').request<T>(document, variables)
    return data
}
