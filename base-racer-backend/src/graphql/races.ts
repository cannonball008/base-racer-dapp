import {
    enumType,
    list,
    nullable,
    objectType,
    queryField,
    stringArg
} from 'nexus'
import { prisma } from '..'
import { Race, RaceStatus } from 'nexus-prisma'
import { $Enums, Prisma } from '@prisma/client'
import { getScoreboard } from './racesCommon'
import { getActiveRace } from './racesCommon'

export default [
    enumType(RaceStatus),
    objectType({
        name: 'Contestant',
        definition(t) {
            t.string('id')
            t.string('name')
            t.string('pic')
        }
    }),
    objectType({
        name: Race.$name,
        description: Race.$description,
        definition(t) {
            t.field(Race.id.name, {
                type: Race.id.type,
            })
            t.field(Race.name.name, {
                type: Race.name.type,
            })
            t.field(Race.startingAt.name, {
                type: Race.startingAt.type,
            })
            t.field(Race.betStatus.name, {
                type: Race.betStatus.type,
            })
            t.field(Race.currentLap.name, {
                type: Race.currentLap.type,
            })
            t.field(Race.laps.name, {
                type: Race.laps.type,
            })
            t.field(Race.status.name, {
                type: Race.status.type,
            })
            t.field(Race.minBet.name, {
                type: Race.minBet.type,
            })
            t.field(Race.maxBet.name, {
                type: Race.maxBet.type,
            })
            t.nullable.boolean('lapFinished', {
                description: 'The current lap might have finished, but not started yet',
            })
            t.nullable.list.field('lapsBetStatus', {
                type: 'Boolean',
                description: 'From 1',
            })
            t.list.field('contestants', {
                type: 'Contestant',
            })
        },
    }),
    queryField('activeRace', {
        type: nullable('Race'),
        args: {
        },
        async resolve(_) {
            const race = await getActiveRace(prisma)
            if (!race) return null
            const lapResult = await prisma.raceResults.findFirst({
                where: {
                    raceId: race.id,
                    lap: race.currentLap,
                },
            })
            let lapsBetStatus = [] as boolean[]
            for (let i = 1; i <= race.laps; i++) {
                const bet = await prisma.raceLapBetStatus.findFirst({
                    where: {
                        raceId: race.id,
                        lap: i,
                    },
                })
                lapsBetStatus.push(bet?.status === 'OPEN')
            }

            return {
                ...race,
                lapFinished: !!lapResult, // have data? Then the lap is finished
                lapsBetStatus,
            }
        },
    }),
    queryField('race', {
        type: 'Race',
        args: {
            id: stringArg()
        },
        async resolve(_, { id }) {
            const race = await prisma.race.findUniqueOrThrow({
                where: {
                    id,
                    deleted: false,
                },
                include: {
                    contestants: true,
                },
            })
            return race
        },
    }),
    objectType({
        name: 'Scoreboard',
        definition(t) {
            t.field('contestant', {
                type: 'Contestant'
            })
            t.field('overallScore', {
                type: 'Int'
            })
            t.field('lapScore', {
                type: list('Int')
            })
        }
    }),
    queryField('activeScoreboard', {
        type: list(nullable('Scoreboard')),
        args: {
        },
        async resolve() {
            return await getScoreboard(prisma)
        }
    })
]
