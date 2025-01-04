import {
    arg,
    enumType,
    list,
    mutationField,
    nullable,
    objectType,
    queryField,
    stringArg,
} from 'nexus'
import { prisma } from '..'
import { Bet, BetResult, BetStatus, BetType } from 'nexus-prisma'
// import { ForbiddenError, ValidationError } from 'apollo-server-core'

export default [
    enumType(BetResult),
    enumType(BetStatus),
    enumType(BetType),
    objectType({
        name: 'BetRace',
        definition(t) {
            t.string('id')
            t.string('name')
        },
    }),
    objectType({
        name: Bet.$name,
        description: Bet.$description,
        definition(t) {
            for (const [key, item] of Object.entries(Bet)) {
                if (key.startsWith('$')) continue
                t.field(key, {
                    type: item.type,
                })
            }
            t.field('race', {
                type: 'BetRace',
            })
        },
    }),
    queryField('raceBets', {
        type: list('Bet'),
        args: {
            raceId: nullable(stringArg()),
            type: nullable(arg({
                type: 'BetType',
            })),
            onlyActive: nullable('Boolean'),
        },
        async resolve(_, {type, onlyActive, raceId}) {
            return await prisma.bet.findMany({
                where: {
                    raceId,
                    betType: type ?? undefined,
                    result: onlyActive ? 'WAITING' : undefined,
                },
                include: {
                    race: {
                        select: {
                            name: true,
                            id: true,
                        },
                    },
                },
            })
        },
    }),
]
