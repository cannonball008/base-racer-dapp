import type { Prisma, PrismaClient } from '@prisma/client'

export async function getScoreboard(prisma: PrismaClient) {
    const race = await getActiveRace(prisma)
    if (!race) return null
    const allResults = await prisma.raceResults.findMany({
        where: {
            raceId: race.id,
        },
    })
    return race.contestants.map((contestant) => {
        let totalScore = 0
        const lapScores = Array.from({ length: race.laps }).map((_, i) => {
            let score = 0
            const isLastLap = i + 1 === race.laps
            const result = allResults.find(r => {
                const lap = (r.lap ?? 0) - 1
                return isLastLap ? (r.lap === null || lap === i) : lap === i
            })
            if (result) {
                if (result.thirdPlaceContestantId === contestant.id) {
                    score += 1
                }
                if (result.secondPlaceContestantId === contestant.id) {
                    score += 3
                }
                if (result.firstPlaceContestantId === contestant.id) {
                    score += 5
                }
            }
            // todo total
            totalScore += score
            return score
        })
        return {
            contestant,
            overallScore: totalScore,
            lapScore: lapScores
        }
    })
}

export async function getActiveRace(prisma: PrismaClient) {
    const nextDay = new Date(Date.now() + 1000 * 60 * 60 * 24)
    const getRace = async (condition) => {
        return await prisma.race.findFirst({
            where: {
                AND: [
                    {
                        deleted: false,
                    },
                    condition
                ],
            },
            orderBy: {
                startingAt: 'desc',
            },
            include: {
                contestants: true,
            },
        })
    }
    return await getRace({
        status: 'ONGOING',
    }) || await getRace({
        startingAt: {
            gte: new Date(),
            lte: nextDay,
        },
        status: 'SCHEDULED'
    }) || await getRace({
        status: 'FINISHED',
    })
}
