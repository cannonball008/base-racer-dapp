import { objectType, queryField, arg, stringArg } from 'nexus'
import { prisma } from '..'

export default [
    objectType({
        name: 'Lap',
        definition(t) {
            t.string('name')
            t.string('betOpen')
        }
    }),
    objectType({
        name: 'Laps',
        definition(t) {
            t.list.field('laps', {
                type: 'Lap'
            })
        }
    }),
    queryField('laps', {
        type: 'Laps',
        args: {
            raceId: stringArg()
        },
        async resolve(_, {raceId}) {
            const race = (await prisma.race.findFirst({
                where: {
                    id: raceId,
                    deleted: false,
                }
            }))!
            const raceLapBetStatus = await prisma.raceLapBetStatus.findMany({
                where: {
                    raceId,
                },
            })
            const laps = Array.from({ length: race.laps, }).map((_, i) => {
                return {
                    name: `Lap ${i + 1}`,
                    betOpen: (i + 1) > race.currentLap
                    // todo
                    // betOpen: raceLapBetStatus[i].betStatus
                }
            })
            return laps
        }
    })
]
