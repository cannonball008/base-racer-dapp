import { PrismaClient } from '@prisma/client'
import { handledEvents, updateRaceResults } from '.'
import { contract } from './ethersContract'

export const filterEmptyRows = <T>(data: T[], excludeProps = [] as string[]) => {
    return data.filter(d => {
        return Object.entries(d).some(([k, v]) => {
            if (excludeProps.includes(k)) return false
            return typeof v === 'string' ? !!v : typeof v === 'number' ? !!v : Array.isArray(v) ? v.length > 0 : !!v
        })
    })
}

type BigNumber = bigint

export const getContestants = async (contract) => {
    const maxContestantId = await contract.currentContestantId()
    console.log('maxContestantId', maxContestantId)
    const contestants: ContestantsResponse[] = await Promise.all(Array.from({ length: Number(maxContestantId) }, (_, i) => contract.contestants(i + 1)))
    return filterEmptyRows(contestants)
}

const prisma = new PrismaClient();

(async () => {


    const maxRaceId = await contract.currentRaceId()
    console.log('maxRaceId', maxRaceId)
    const contestants = await getContestants(contract)
    // const parseData = [
    //     (r: RacesResponse) => r,
    //     ...contestants.map(contestant => (r: boolean, d) => {
    //         // console.log('contestant', contestant, r, d)
    //         if (!r) return {}
    //         d.contestants ??= []
    //         d.contestants.push(contestant)
    //         return {}
    //     }),
    // ]
    // const dataRaw = await Promise.all(
    //     Array.from({ length: Number(maxRaceId) }).flatMap((_, i) => {
    //         const n = i + 1
    //         return [
    //             contract.races(n),
    //             ...contestants.map(contestant => contract.raceContestants(n, contestant.id)),
    //             // contract.lapBetStatus(n),
    //         ]
    //     }),
    // )
    // const races: RacesType[] = []
    // for (const [i, fetched] of dataRaw.entries()) {
    //     const mapPos = i % parseData.length
    //     const parse = parseData[mapPos]!
    //     const realIndex = Math.floor(i / parseData.length)
    //     races[realIndex] ??= {} as any
    //     Object.assign(races[realIndex]!, parse(fetched as any, races[realIndex!]))
    // }

    for (const contestant of contestants) {
        // console.log('contestant', contestant)
        const first = await prisma.contestants.findFirst({
            where: {
                id: contestant.id.toString(),
            },
            select: {
                id: true,
            },
        })
        if (!first) {
            console.log('to be created', contestant)
            // handledEvents.ContestantCreated(contestant.id, contestant)
        }
    }

    for (let i = 1; i <= maxRaceId; i++) {
        const race: RacesResponse = await contract.races(i)
        for (let j = 1; j <= race.laps; j++) {
            const lapBetStatus = await contract.lapBetStatus(i, j)
            // console.log('LapBetStatusChange', j, lapBetStatus)
            // await handledEvents.LapBetStatusChange(i, j, lapBetStatus)
            const lapResult: LapResultsResponse = await contract.lapResults(i, j)
            // // await updateRaceResults(race.id, lapResult.firstPlaceContestantId, lapResult.secondPlaceContestantId, lapResult.thirdPlaceContestantId, j)
            // handledEvents.LapFinished(race.id, j as any, lapResult.firstPlaceContestantId, lapResult.secondPlaceContestantId, lapResult.thirdPlaceContestantId)
            // console.log('lapResult', lapResult)
        }
        const raceResult = await contract.raceResults(i)
        if (raceResult.firstPlaceContestantId) {
            // console.log('RaceFinished', raceResult)
            // await handledEvents.RaceFinished(race.id, raceResult.firstPlaceContestantId)
        }

        // console.log('updateRaceResults-null', raceResult)
        // await updateRaceResults(race.id, raceResult.firstPlaceContestantId, raceResult.secondPlaceContestantId, raceResult.thirdPlaceContestantId, null)
        // console.log('race', race)
        // await handledEvents.RaceCreated(race.id, race)
    }

    // const maxBet = await contract.currentBetId()
    // for (let i = 1; i <= maxBet; i++) {
    //     const bet = await contract.betsById(i)
    //     console.log('bet', bet)
    //     // await handledEvents.BetCreated(bet.id, bet)
    // }


})();
interface RacesResponse {
    name: string
    0: string
    laps: BigNumber
    1: BigNumber
    id: BigNumber
    2: BigNumber
    startTime: BigNumber
    3: BigNumber
    finishTime: BigNumber
    4: BigNumber
    currentLap: BigNumber
    5: BigNumber
    status: number
    6: number
    betStatus: number
    7: number
    startingTimestamp: BigNumber
    8: BigNumber
    minBet: BigNumber
    9: BigNumber
    maxBet: BigNumber
    10: BigNumber
    length: 11
}

interface ContestantsResponse {
    name: string
    0: string
    description: string
    1: string
    id: BigNumber
    2: BigNumber
    pic: string
    3: string
    length: 4
}

interface LapResultsResponse {
    raceId: BigNumber
    0: BigNumber
    lap: BigNumber
    1: BigNumber
    firstPlaceContestantId: BigNumber
    2: BigNumber
    secondPlaceContestantId: BigNumber
    3: BigNumber
    thirdPlaceContestantId: BigNumber
    4: BigNumber
    length: 5
}
