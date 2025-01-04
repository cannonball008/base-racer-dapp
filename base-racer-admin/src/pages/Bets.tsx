import { Button, Table, TableHeader, TableColumn, TableBody, Spinner, TableRow, TableCell } from '@nextui-org/react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useFetch } from '../fetcher'
import { gql } from 'graphql-request'
import { clampAddress, getProvider } from '../utils'
import { useEffect, useState } from 'react'
import { getContract } from '../abi-src'
import { AwaitableActionButton } from '../AwaitableActionButton'
import { showModal } from '../GlobalModal'
import { Delete } from '@mui/icons-material'
import { ethers } from 'ethers'

const columns = [
    { label: 'Bettor', key: 'bettor' },
    { label: 'Lap', key: 'lap' },
    { label: 'Amount', key: 'amount' },
    { label: 'Contestant', key: 'contestantId' },
    { label: 'Bet Time', key: 'createdAt' },
    { label: 'Actions', key: 'actions' },
]

export default () => {
    const raceId = useParams().raceId!
    const [refetchCount, setRefetchCount] = useState(0)

    type RaceBet = {
        id: string
        bettor: string
        amount: number
        contestantId: string
        createdAt: string
        lap: number
    }

    type Data = {
        raceBets: RaceBet[]
        lapRaceBets: RaceBet[]
    }

    const { data } = useFetch<Data>({
        document: gql`
            query Query($raceId: String!) {
                raceBets(onlyActive: true, raceId: $raceId) {
                    id
                    bettor
                    amount
                    contestantId
                    createdAt
                    lap
                }
            }
        `,
        variables: {
            raceId,
        },
        stateCounter: refetchCount,
    })

    const allBets = [...(data?.raceBets ?? []), ...(data?.lapRaceBets ?? [])]

    useEffect(() => {
        ;(async () => {
            const contract = await getContract()
            contract.on('BetUpdated', () => {
                setRefetchCount(n => n + 1)
            })
            contract.on('BetDeleted', () => {
                setRefetchCount(n => n + 1)
            })
            contract.on('BetCreated', () => {
                setRefetchCount(n => n + 1)
            })
        })()
    }, [])

    const renderCell = (item: RaceBet, columnKey) => {
        const cellValue = item[columnKey] ?? ''

        switch (columnKey) {
            case 'bettor':
                return (
                    <div
                        title={cellValue}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            // copy
                            navigator.clipboard.writeText(cellValue)
                        }}
                    >
                        {clampAddress(cellValue)}
                    </div>
                )
            case 'createdAt':
                return new Date(cellValue).toLocaleString()
            case 'amount':
                return `${cellValue} DCR`
            case 'lap':
                return cellValue || 'Full Race'
            case 'actions':
                return (
                    <div className="relative flex items-center gap-2">
                        <AwaitableActionButton
                            danger
                            label="Delete Bet"
                            onClick={async () => {
                                const contract = await getContract()
                                const choice = await showModal('Are you sure you want to delete this bet?', 'Delete')
                                if (!choice) return
                                await contract.deleteBet(item.id)
                            }}
                        >
                            {<Delete />}
                        </AwaitableActionButton>
                    </div>
                )
            default:
                return cellValue
        }
    }

    return (
        <div className="flex flex-col justify-center gap-2">
            <div>
                <Link to={`/`}>
                    <Button>Back to races</Button>
                </Link>
            </div>
            <Table aria-label="Data list" classNames={{ table: 'min-h-[110px]' }}>
                <TableHeader>
                    {columns.map(column => {
                        return <TableColumn key={column.key}>{column.label}</TableColumn>
                    })}
                </TableHeader>
                <TableBody
                    isLoading={!data}
                    loadingContent={<Spinner label="Loading..." className="mt-[43px]" />}
                    emptyContent={!data ? '' : 'No active bets to manage.'}
                    items={(allBets ?? []) as any[]}
                >
                    {item => <TableRow key={item.id}>{columnKey => <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
                </TableBody>
            </Table>
        </div>
    )
}
