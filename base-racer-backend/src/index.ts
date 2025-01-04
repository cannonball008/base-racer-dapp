import { ApolloServer } from '@apollo/server'
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'

// import './testnet'
import { Prisma, PrismaClient } from '@prisma/client'
import { startStandaloneServer } from '@apollo/server/standalone'
import { schema } from './schema'
import { AbiEvents, ContestantsResponse, RacesResponse, RaceBetsResponse } from './abiTypes'
import './sentry'
import { captureError } from './sentry'
import { upsertWithoutId } from './prismaUtils'
import { contract } from './ethersContract'

import { externalEvents } from './telegram'
import './testWatchdog'

if (process.env.NODE_ENV === 'production')
    for (const environmentVariable of ['CORS_FRONTEND_DOMAIN'])
        if (!process.env[environmentVariable])
            console.warn(
                `Environment variable ${environmentVariable} is not provided.`,
            )

export const prisma = new PrismaClient()

export const apollo = new ApolloServer({
    schema,
    plugins: [
        // ApolloServerPluginDrainHttpServer({ httpServer }),
        process.env.NODE_ENV === 'production'
            ? ApolloServerPluginLandingPageProductionDefault()
            : ApolloServerPluginLandingPageLocalDefault(),
    ],
})

startStandaloneServer(apollo, {
    listen: {
        port: process.env.NODE_ENV === 'production' ? 80 : 4000,
    },
}).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})

// sync db

const raceUpdate = async (_id: BigInt, race: RacesResponse) => {
    const id = _id.toString()
    const raceDb: Omit<Prisma.RaceCreateInput, 'id'> = {
        name: race.name,
        startingAt: new Date(Number(race.startingTimestamp) * 1000),
        updatedAt: new Date(),
        laps: Number(race.laps),
        finishedAt: race.finishTime ? new Date(Number(race.finishTime) * 1000) : null,
        currentLap: Number(race.currentLap),
        betStatus: race.betStatus == 0 ? 'OPEN' : 'CLOSED',
        status: race.status == 0 ? 'SCHEDULED' : race.status == 1 ? 'CANCELLED' : race.status == 2 ? 'ONGOING' : 'FINISHED',
        minBet: formatAmount(race.minBet),
        maxBet: formatAmount(race.maxBet)
    }
    awaitingRaceAdd = new Promise<void>(async (resolve) => {
        await prisma.race.upsert({
            where: { id },
            create: {
                ...raceDb,
                id
            },
            update: raceDb
        })
        resolve()
    })
    await awaitingRaceAdd
    awaitingRaceAdd = undefined
}
const contestantUpdate = async (created: boolean, _id: BigInt, contestant: ContestantsResponse) => {
    const id = _id.toString()
    const raceDb = {
        pic: contestant.pic,
        name: contestant.name,
    }
    await prisma.contestants.upsert({
        where: { id },
        create: { ...raceDb, id, raceIds: [], },
        update: raceDb
    })
}

export const updateRaceResults = async (raceId, first, second, third, lap: number | null) => {
    const updateData = {
        firstPlaceContestantId: first,
        secondPlaceContestantId: second,
        thirdPlaceContestantId: third,
    }
    await upsertWithoutId(prisma.raceResults, { raceId, lap }, {
        raceId,
        lap,
        ...updateData
    })
}

const betUpdate = async (_betId: BigInt, bet: RaceBetsResponse, result, txHash?) => {
    const betId = _betId.toString()
    await prisma.bet.upsert({
        where: { id: betId },
        create: {
            id: betId,
            raceId: bet.raceId.toString(),
            contestantId: bet.contestantId.toString(),
            amount: formatAmount(bet.amount),
            bettor: bet.bettor,
            betType: bet.betType == 0 ? 'RACE' : 'LAP',
            result: result == 0 ? 'WIN' : result == 1 ? 'LOSE' : result == 2 ? 'WAITING' : 'REMOVED',
            lap: Number(bet.lap),
            claimed: bet.claimed,
            tx: txHash,
        },
        update: {
            raceId: bet.raceId.toString(),
            contestantId: bet.contestantId.toString(),
            amount: formatAmount(bet.amount),
            bettor: bet.bettor,
            betType: bet.betType == 0 ? 'RACE' : 'LAP',
            result: result == 0 ? 'WIN' : result == 1 ? 'LOSE' : result == 2 ? 'WAITING' : 'REMOVED',
            lap: Number(bet.lap),
        },
    })
}

// todo use transactions
let awaitingRaceAdd
export const handledEvents = {
    RaceCreated: raceUpdate,
    RaceUpdated: raceUpdate,
    RaceDeleted: async (_id: BigInt) => {
        const id = _id.toString()
        const race = await prisma.race.findUnique({
            where: {
                id
            },
        })
        if (!race) return
        await prisma.race.update({
            where: {
                id
            },
            data: {
                deleted: true,
            },
        })
    },
    //@ts-ignore
    ContestantCreated: (...args) => contestantUpdate(true, ...args),
    //@ts-ignore
    ContestantUpdated: (...args) => contestantUpdate(false, ...args),
    ContestantRaceStatusChanged: async (_raceId: BigInt, _contestantId: BigInt, status: BigInt) => {
        const raceId = _raceId.toString()
        const contestantId = _contestantId.toString()
        const { contestantIds = [] } = (await prisma.race.findUnique({
            where: {
                id: raceId,
            },
        })) ?? {}
        await prisma.race.update({
            where: { id: raceId },
            data: {
                contestantIds: status ? [...contestantIds, contestantId] : contestantIds.filter(id => id !== contestantId)
            },
        })
    },
    async RaceCreatedWithContestants(_raceId: BigInt, _race: RacesResponse, _contestantIds: BigInt[]) {
        await raceUpdate(_raceId, _race)
        for (const _contestantId of _contestantIds) {
            const contestantId = _contestantId.toString()
            const foundContestant = await prisma.contestants.findFirst({
                where: {
                    id: contestantId,
                },
            })
            if (!foundContestant) {
                console.log('missing contestant', contestantId, 'creating')
                const contestant = await contract.contestants(contestantId)
                await handledEvents.ContestantCreated(_contestantId, contestant)
            }
        }
        await prisma.race.update({
            where: { id: _raceId.toString() },
            data: {
                contestantIds: _contestantIds.map(id => id.toString()),
            },
        })
        externalEvents.RaceCreatedWithContestants(_raceId, _race, _contestantIds)
    },
    async ContestantRaceStatusChangedBatch(_raceId: BigInt, _contestantIds: BigInt[], status: BigInt) {
        const raceId = _raceId.toString()
        const contestantIds = _contestantIds.map(id => id.toString())
        const race = (await prisma.race.findUnique({
            where: {
                id: raceId,
            },
        }))!

        if (awaitingRaceAdd) await awaitingRaceAdd
        const updatedContestantIds = status ? [...race.contestantIds, ...contestantIds] : race.contestantIds.filter(id => !contestantIds.includes(id))
        await prisma.race.update({
            where: { id: raceId },
            data: {
                contestantIds: [...new Set(updatedContestantIds)],
            },
        })
    },
    LapBetStatusChange(_raceId: BigInt, _lap: BigInt, _status) {
        const raceId = _raceId.toString()
        const lap = Number(_lap)
        upsertWithoutId(prisma.raceLapBetStatus, {
            raceId,
            lap
        }, {
            raceId,
            lap,
            status: _status == 0 ? 'OPEN' : 'CLOSED',
        })
    },
    async RaceStatusChange(_raceId: BigInt, _status) {
        await prisma.race.update({
            where: {
                id: _raceId.toString()
            },
            data: {
                status: _status == 0 ? 'SCHEDULED' : _status == 1 ? 'CANCELLED' : _status == 2 ? 'ONGOING' : 'FINISHED',
            },
        })
    },
    ContestantDeleted: async (_id: BigInt) => {
        const id = _id.toString()
        await prisma.contestants.delete({ where: { id } })
    },
    RaceStarted: async (_id: BigInt) => {
        const id = _id.toString()
        await prisma.race.update({
            where: { id },
            data: {
                status: 'ONGOING',
                betStatus: 'CLOSED',
            }
        })
    },
    async LapFinished(_raceId: BigInt, _lap: BigInt, _first: BigInt, _second: BigInt, _third: BigInt) {
        const raceId = _raceId.toString()
        const lap = Number(_lap)
        const first = _first.toString()
        const second = _second.toString()
        const third = _third.toString()
        await updateRaceResults(raceId, first, second, third, lap)

        await prisma.bet.updateMany({
            where: {
                raceId,
                lap,
                result: 'WAITING',
                betType: 'LAP',
                contestantId: first,
            },
            data: {
                result: 'WIN',
            }
        })
        const wonBets = await prisma.bet.findMany({
            where: {
                raceId,
                lap,
                result: 'WIN',
                betType: 'LAP',
                contestantId: first,
            },
        })
        for (const wonBet of wonBets) {
            const wonAmount = await contract.getLapResult(raceId, lap, wonBet.bettor, wonBet.contestantId)
            await prisma.bet.update({
                where: {
                    id: wonBet.id,
                },
                data: {
                    winAmount: formatAmount(wonAmount),
                },
            })
        }
        await prisma.bet.updateMany({
            where: {
                raceId,
                lap,
                result: 'WAITING',
                betType: 'LAP',
                contestantId: { not: first },
            },
            data: {
                result: 'LOSE',
            },
        })
    },
    RaceFinished: async (_raceId: BigInt, _winner: BigInt) => {
        const raceId = _raceId.toString()
        const first = _winner.toString()
        const second = '0'
        const third = '0'
        // contestants results
        // todo transaction should be used
        await prisma.race.update({
            where: { id: raceId },
            data: {
                status: 'FINISHED',
            }
        })
        await updateRaceResults(raceId, first, second, third, null)

        await prisma.bet.updateMany({
            where: {
                raceId,
                betType: 'RACE',
                result: 'WAITING',
                contestantId: first,
            },
            data: {
                result: 'WIN',
            }
        })
        const wonBets = await prisma.bet.findMany({
            where: {
                raceId,
                result: 'WIN',
                betType: 'RACE',
                contestantId: first,
            },
        })
        for (const wonBet of wonBets) {
            const wonAmount = await contract.getRaceResult(raceId, wonBet.bettor)
            await prisma.bet.update({
                where: {
                    id: wonBet.id,
                },
                data: {
                    winAmount: formatAmount(wonAmount),
                },
            })
        }
        await prisma.bet.updateMany({
            where: {
                raceId,
                betType: 'RACE',
                result: 'WAITING',
                contestantId: { not: first },
            },
            data: {
                result: 'LOSE',
            },
        })
        // await prisma.raceResults.upsert({
        //     where: { id: undefined, raceId, lap: null },
        //     create: {
        //         id: raceId,
        //         raceId: raceId,
        //         firstPlaceContestantId: first,
        //         secondPlaceContestantId: second,
        //         thirdPlaceContestantId: third,
        //         lap: null,
        //     },
        //     update: {
        //         firstPlaceContestantId: first,
        //         secondPlaceContestantId: second,
        //         thirdPlaceContestantId: third,
        //     },
        // })
    },
    async RaceLapStarted(_raceId: BigInt, _lap: BigInt) {
        const raceId = _raceId.toString()
        const lap = Number(_lap)
        await prisma.race.update({
            where: { id: raceId },
            data: {
                currentLap: lap,
            },
        })
        // await prisma.raceLapBetStatus.upsert({
        //     where: { id: raceId },
        //     create: {
        //         id: raceId,
        //     },
        // })
    },
    async BetCreated(_betId: BigInt, bet: RaceBetsResponse, _meta) {
        const txHash = _meta.log.transactionHash
        await betUpdate(_betId, bet, 2, txHash)
    },
    async BetUpdated(_betId: BigInt, bet: RaceBetsResponse) {
        await betUpdate(_betId, bet, bet.result)
    },
    async BetDeleted(_betId: BigInt) {
        const betId = _betId.toString()
        await prisma.bet.update({
            where: {
                id: betId
            },
            data: {
                result: 'REMOVED',
            },
        })
    },
    async OwnershipTransferred(newOwner) {
    },
    LapRewardClaimed: async (_raceId: BigInt, _lap: BigInt, address: BigInt, _amount: BigInt) => {
        const raceId = _raceId.toString()
        const lap = Number(_lap)
        const amount = formatAmount(_amount)
        await prisma.bet.updateMany({
            where: {
                raceId,
                lap,
                betType: 'LAP',
                bettor: address.toString(),
            },
            data: {
                claimed: true,
            }
        })
    },
    RaceRewardClaimed: async (_raceId: BigInt, address: BigInt, _amount: BigInt) => {
        const raceId = _raceId.toString()
        const amount = formatAmount(_amount)
        await prisma.bet.updateMany({
            where: {
                raceId,
                betType: 'RACE',
                bettor: address.toString(),
            },
            data: {
                claimed: true,
            }
        })
    },
} satisfies Record<AbiEvents, any>

const toNumber = (arg) => arg === null ? null : Number(arg)
const formatAmount = (amount: BigInt) => Number(amount) / 10 ** 18

Object.entries(handledEvents).forEach(([event, handler]) => {
    if (!handler) return
    contract.on(event, (...args) => {
        try {
            console.log('got event', args)
            Error.stackTraceLimit = 40
            handler.apply(handledEvents, args)
        } catch (err) {
            console.error("Critical error in event handler", event, args)
            console.error(err)
            captureError(err)
        }
    })
})
