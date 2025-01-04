import { Table, Button, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Spinner, Avatar, CircularProgress } from '@nextui-org/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Edit, Delete, Stop, AttachMoney, PlayCircle, PlayCircleOutline } from '@mui/icons-material'
import { getContestants, getContract } from '../abi-src'
import { filterEmptyRows } from '../utils'
import { ContestantsResponse, RacesResponse } from '../abi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useWalletClient } from 'wagmi'
import { showModal } from '../GlobalModal'
import { AwaitableActionButton } from '../AwaitableActionButton'
import { gql } from 'graphql-request'
import { makeRequest } from '../fetcher'
import { proxy, useSnapshot } from 'valtio'
// import { multicall } from '@wagmi/core'
// import { config } from '../wagmi'
// import abi from '../abi.json'

type RacesType = RacesResponse & {}

const firstUpperCase = str => str[0].toUpperCase() + str.slice(1).toLowerCase()

const columns = {
    race: [
        { label: 'Race Name', key: 'name' },
        { label: 'Contestants', key: 'contestants' },
        { label: 'Start Time', key: 'startingTimestamp' },
        { label: 'Laps', key: 'laps' },
        { label: 'Status', key: 'status' },
        { label: 'Bet Status', key: 'betStatus' },
        { label: 'Actions', key: 'actions' },
    ] as { label: string; key: keyof RacesType }[],
    contestant: [
        { label: 'Race Name', key: 'name' },
        { label: 'Description', key: 'description' },
        { label: 'Picture URL', key: 'pic' },
        { label: 'Actions', key: 'actions' },
    ] as { label: string; key: keyof ContestantsResponse }[],
}
// model Bet {
//     id           String    @id @map("_id")
//     bettor       String
//     raceId       String
//     lap          Int?
//     amount       Int
//     contestantId String
//     result       BetResult
//     betType      BetType
//     createdAt    DateTime  @default(now())
//   }
// status: upcoming, live, finished (5d ago)

// const getOwner = async () => {
//     const result = await multicall(config, {
//         contracts: [
//             {
//                 address: '0xb0A909C53d47F9cfe06D56052BFFFf30BB766717',
//                 abi: abi.abi,
//                 functionName: 'owner',
//                 args: []
//             }
//         ],
//     })
//     console.log(result)
// }

const updateStateProxy = proxy({
    update: 0,
})

const forceRefresh = () => {
    updateStateProxy.update++
}

export default () => {
    const { update } = useSnapshot(updateStateProxy)

    return <Inner key={update} />
}

const Inner = () => {
    const [data, setData] = useState(null as null | RacesType[] | ContestantsResponse[])
    const [contract, setContract] = useState(null as null | Awaited<ReturnType<typeof getContract>>)
    const [highlightCell, setHighlightCell] = useState(null as null | string)
    const [activeRaceLapFinished, setActiveRaceLapFinished] = useState(false)
    const walletClient = useWalletClient()
    const location = useLocation()

    const entity = {
        '/': 'race',
        '/contestants': 'contestant',
    }[location.pathname]!

    const navigate = useNavigate()

    const renderCell = (item, columnKey) => {
        const cellValue = item[columnKey] ?? ''

        const betStatus = entity === 'race' && item.betStatus === 0 ? 'OPEN' : 'CLOSED'

        switch (columnKey) {
            //   case "name":
            //     return (
            //       <User
            //         avatarProps={{radius: "lg", src: user.avatar}}
            //         description={user.email}
            //         name={cellValue}
            //       >
            //         {user.email}
            //       </User>
            //     );
            case 'status': {
                const race = item as RacesType
                const mapped = race.status === 0 ? 'SCHEDULED' : race.status === 1 ? 'CANCELLED' : race.status === 2 ? 'ONGOING' : 'FINISHED'
                const statusColorMap = {
                    SCHEDULED: 'warning',
                    ONGOING: 'success',
                    FINISHED: 'danger',
                    CANCELLED: 'danger',
                }
                return (
                    <Chip className="capitalize" color={(statusColorMap[mapped] as any) ?? 'warning'} size="sm" variant="flat">
                        {firstUpperCase(mapped) || 'Unknown'}
                    </Chip>
                )
            }
            case 'laps': {
                const race = item as RacesType
                return `${race.currentLap}/${race.laps}`
            }
            case 'betStatus':
                const mapped = betStatus
                const statusColorMap = {
                    OPEN: 'success',
                    CLOSED: 'danger',
                }
                return (
                    <Chip className="capitalize" color={(statusColorMap[mapped] as any) ?? 'warning'} size="sm" variant="flat">
                        {firstUpperCase(mapped) || 'Unknown'}
                    </Chip>
                )
            case 'pic':
                let url = cellValue
                return <Avatar src={url} name={item.name} style={{ width: 30, height: 30 }} />
            case 'contestants':
                return cellValue?.map?.(c => c.name).join(', ')
            case 'startingTimestamp': {
                const formatter = new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                })
                const date = new Date(cellValue * 1000)
                return formatter.format(date)
            }
            case 'actions':
                let raceActions
                if (entity === 'race') {
                    const race = item as RacesType
                    const isStarted = race.status == 2
                    const canBeStarted = race.status == 0
                    const isLastLap = race.currentLap == race.laps
                    raceActions = (
                        <>
                            {canBeStarted && (
                                <AwaitableActionButton
                                    label={'Start race'}
                                    onClick={async () => {
                                        if (item.contestants?.length < 1) {
                                            throw new Error('Not enough contestants to start the race, edit the race to include at least 3 contestants')
                                        }
                                        const result = await showModal('Are you sure you want to start the race?', 'Start')
                                        if (!result) return
                                        await contract!.startRace(item.id)
                                        forceRefresh()
                                    }}
                                >
                                    {<PlayCircleOutline />}
                                </AwaitableActionButton>
                            )}
                            {isStarted &&
                                (!activeRaceLapFinished ? (
                                    <AwaitableActionButton
                                        label={'Finish lap'}
                                        onClick={() => {
                                            navigate(`/finish/${item.id}`)
                                        }}
                                    >
                                        <Stop />
                                    </AwaitableActionButton>
                                ) : !isLastLap ? (
                                    <AwaitableActionButton
                                        label={'Start next lap'}
                                        onClick={async () => {
                                            await contract!.startLap(item.id, item.currentLap + 1)
                                            forceRefresh()
                                        }}
                                    >
                                        <PlayCircle />
                                    </AwaitableActionButton>
                                ) : (
                                    <AwaitableActionButton
                                        label={'Finish race'}
                                        onClick={async () => {
                                            // contract!.(item.id)
                                            await contract!.setRaceResult(item.id)
                                            forceRefresh()
                                        }}
                                    >
                                        <Stop />
                                    </AwaitableActionButton>
                                ))}
                            <AwaitableActionButton
                                label={'Bets'}
                                onClick={() => {
                                    navigate(`/bets/${item.id}`)
                                }}
                            >
                                <AttachMoney />
                            </AwaitableActionButton>
                        </>
                    )
                }

                return (
                    <div className="relative flex items-center gap-2">
                        {/* <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">{<Visibility />}</span>
                        </Tooltip> */}
                        <Link to={`/${entity}/${item.id}`}>
                            <Tooltip content={`Edit ${entity}`}>
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">{<Edit />}</span>
                            </Tooltip>
                        </Link>
                        {raceActions}
                        <AwaitableActionButton
                            danger
                            label={`Delete ${entity}`}
                            onClick={async () => {
                                const result = await showModal(`Are you sure you want to delete this ${entity}?`, 'Delete')
                                if (!result) return
                                const id = item.id
                                if (entity === 'race') {
                                    await contract!.deleteRace(id)
                                } else if (entity === 'contestant') {
                                    await contract!.deleteContestant(id)
                                }
                                // todo
                                forceRefresh()
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

    useEffect(() => {
        setHighlightCell(null)
        ;(async () => {
            const contract = await getContract()
            setContract(contract)
            let data
            if (entity === 'race') {
                const maxRaceId = await contract.currentRaceId()
                console.log('maxRaceId', maxRaceId)
                const contestants = await getContestants(contract)
                const parseData = [(r: RacesResponse) => r]
                const dataRaw = await Promise.all(
                    Array.from({ length: Number(maxRaceId) }).flatMap((_, i) => {
                        const n = i + 1
                        return [contract.races(n)]
                    }),
                )
                const races: RacesType[] = []
                for (const [i, fetched] of dataRaw.entries()) {
                    const mapPos = i % parseData.length
                    const parse = parseData[mapPos]!
                    const realIndex = Math.floor(i / parseData.length)
                    races[realIndex] ??= {} as any
                    // Object.assign(races[realIndex]!, parse(fetched as any, races[realIndex!]))
                    Object.assign(races[realIndex]!, parse(fetched as any))
                }
                // sort by startingTimestamp
                data = races.sort((a, b) => a.startingTimestamp - b.startingTimestamp)
                data = filterEmptyRows(data, ['contestants'])

                // and now fetch the contestants
                await Promise.all(
                    data.map(race => {
                        return Promise.all(contestants.map(c => contract.raceContestants(race.id, c.id))).then(contestantListBoolean => {
                            // r.contestants = contestants
                            contestantListBoolean.forEach((r, i) => {
                                if (!r) return {}
                                const contestant = contestants[i]!
                                race['contestants'] ??= []
                                race['contestants'].push(contestant)
                                return {}
                            })
                        })
                    }),
                )

                try {
                    const activeRace = await makeRequest<{
                        activeRace?: {
                            id: string
                            lapFinished: boolean
                        }
                    }>({
                        document: gql`
                            query A {
                                activeRace {
                                    id
                                    lapFinished
                                }
                            }
                        `,
                    })
                    setHighlightCell(activeRace?.activeRace?.id ?? null)
                    setActiveRaceLapFinished(activeRace?.activeRace?.lapFinished ?? false)
                } catch (err) {
                    setData(data)
                    throw err
                }
            }
            if (entity === 'contestant') {
                const contestants = await getContestants(contract)
                data = contestants
            }
            // filter non empty data
            setData(data)
            console.log('got data', data)
        })()
    }, [])

    return (
        <div className="flex flex-col justify-center gap-2">
            <div>
                <Link to={`/${entity}`}>
                    <Button>Add {entity}</Button>
                </Link>
            </div>
            <Table aria-label="Data list" classNames={{ table: 'min-h-[110px]' }}>
                <TableHeader>
                    {columns[entity].map(column => {
                        return <TableColumn key={column.key}>{column.label}</TableColumn>
                    })}
                </TableHeader>
                <TableBody
                    isLoading={!data}
                    loadingContent={<Spinner label="Loading..." className="mt-[43px]" />}
                    emptyContent={!data ? '' : 'No rows to display.'}
                    items={(data ?? []) as any[]}
                >
                    {item => (
                        <TableRow
                            key={item.id}
                            style={{
                                // red with opacity 0.3
                                background: highlightCell === String(item.id) ? 'rgba(142, 255, 111, 0.283)' : undefined,
                            }}
                        >
                            {columnKey => <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
