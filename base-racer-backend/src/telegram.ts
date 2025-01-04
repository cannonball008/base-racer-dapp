import * as TelegramBot from 'node-telegram-bot-api'
import './sentry'
import { captureError } from './sentry'
import { contract } from './ethersContract'
import { PrismaClient } from '@prisma/client'
import { RacesResponse } from './abiTypes'
import { getScoreboard } from './graphql/racesCommon'

console.log('tg bot is running')

const TOKEN = '7153017045:AAGSWNaE8Jl0AvHQkfgdUtNZ-jMiHYsXhEk'
const bot: TelegramBot = new (TelegramBot['default'] ? TelegramBot['default'] : TelegramBot)(TOKEN, {
    polling: true,
    request: {
        agentOptions: {
            keepAlive: true,
            family: 4
        }
    }
})

const prisma = new PrismaClient()

bot.on('message', async (message, metadata) => {
    // respond only to initial message
    if (message.text === '/start') {
        // DCR Racing events
        bot.sendMessage(message.chat.id, 'Hello! I am a bot that will notify you about new events in the world of DCR Racing.', {})
    }
    const chatId = message.chat.id.toString()
    const existingChat = await prisma.telegramChat.findUnique({
        where: {
            chatId: chatId,
        },
    })
    if (!existingChat) {
        // antipattern!
        const newEntryId = Math.floor(Math.random() * 1000000)
        await prisma.telegramChat.create({
            data: {
                chatId: chatId,
                id: newEntryId,
            },
        })
    }
})

// send notification after 1 sec

// buy token link
const footer = `
🔗 [Make a Bet](https://dcr.bet/betting) | [Buy Tokens](https://app.uniswap.org/swap?exactField=output&inputCurrency=eth&outputCurrency=0x0711ed8b4d1eb1a935cdcc376a205c7dca584457&chain=base) | [Tg](https://t.me/diecastracer) | [Warpcast](https://warpcast.com/diecastracer)
`

export const formatNumber = (value: string | number, digits = 2) => {
    if (!value) return value
    try {
        const number = Number(value)
        if (isNaN(number)) return '-'
        return Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: digits,
        }).format(number)
    } catch {
        return '-'
    }
}

const templates = {
    async newRace(race: RacesResponse, _contestantIds: BigInt[]) {
        const contestants = await prisma.contestants.findMany({
            where: {
                id: {
                    in: _contestantIds.map((id) => id.toString()),
                },
            },
        })
        return `

💠 New Race Scheduled
Race Bets and Lap 1 Bets are now open

⏱Total Laps: ${race.laps}
💵 Bets: ${formatAmount(race.minBet)} - ${formatAmount(race.maxBet)} DCR
🏎 Contestants: ${contestants.length}
${contestants.map((contestant) => `🚘 ${contestant.name}`).join('\n')}
`.trim()
    },
    async raceStarted(race: { id, laps, minBet, maxBet }) {
        const contestants = await prisma.contestants.findMany({
            where: {
                races: {
                    some: {
                        id: race.id
                    },
                },
            },
        })
        return `

🏁 The Race has Started

⏱Total Laps: ${race.laps}
💵 Bets: ${race.minBet} - ${race.maxBet} DCR
🏎 Contestants: ${contestants.length}
${contestants.map((contestant) => `🚘 ${contestant.name}`).join('\n')}
`.trim()
    },
}

let lastSent = 0
const sendAllMessage = async (text: string, photo?) => {
    // throttle 6sec
    if (Date.now() - lastSent < 5000) {
        return
    }
    lastSent = Date.now()

    console.log(`[${new Date().toISOString()}] Sending message to all users`, !!photo)
    const users = await prisma.telegramChat.findMany()
    const results = await Promise.allSettled(users.map(async (user) => {
        // await bot.sendMessage(user.chatId, text, {})
        // send with image
        await bot.sendPhoto(user.chatId, photo || 'https://i.imgur.com/eKNyvLf.jpeg', {
            caption: `${text}\n${footer}`,
            parse_mode: 'Markdown',
        })
    }))
    // throw errored
    results.forEach((result) => {
        if (result.status === 'rejected') {
            if (!result.reason.message?.includes('Forbidden: bot was')) {
                captureError(result.reason)
            }
        }
    })
}

export const externalEvents = {
    'RaceCreatedWithContestants': async (_raceId: BigInt, _race: RacesResponse, _contestantIds: BigInt[]) => {
        const text = await templates.newRace(_race, _contestantIds)
        sendAllMessage(text)
    }
}

const events = {
    LapFinished: async (_raceId: BigInt, _lap: BigInt, _first: BigInt, _second: BigInt, _third: BigInt) => {
        const raceId = _raceId.toString()
        const lap = Number(_lap)
        const first = _first.toString()
        // const second = _second.toString()
        // const third = _third.toString()

        if (first === '0') {
            const message = `🟢 LAP ${lap}: NO WINNER`
            sendAllMessage(message)
            return
        }

        const contestant = await prisma.contestants.findUniqueOrThrow({
            where: {
                id: first,
            },
        })

        const wonBets = await prisma.bet.findMany({
            where: {
                raceId,
                lap,
                betType: 'LAP',
                contestantId: first,
            },
        })
        const totalBet = wonBets.reduce((acc, bet) => acc + Number(bet.amount), 0)
        let totalWin = 0

        for (const wonBet of wonBets) {
            const wonAmount = await contract.getLapResult(raceId, lap, wonBet.bettor, wonBet.contestantId)
            totalWin += formatAmount(wonAmount)
        }

        const data = {
            text: `
🟢 LAP ${lap} WINNER

🏎 ${contestant.name}

💵 Total Bet: ${totalBet} DCR
🎯Total Win: ${totalWin} DCR

🏆 Congratulations to all winners!
        `.trim(),
            pic: contestant.pic,
        }
        sendAllMessage(data.text, data.pic)
    },
    RaceStarted: async (_id: BigInt) => {
        const race = await prisma.race.findUniqueOrThrow({
            where: {
                id: _id.toString(),
            },
        })
        const text = await templates.raceStarted(race)
        sendAllMessage(text)
    },
    RaceFinished: async (_raceId: BigInt, _winner: BigInt) => {
        const raceId = _raceId.toString()
        const first = _winner.toString()

        const contestant = await prisma.contestants.findUnique({
            where: {
                id: first,
            },
        })

        const wonBets = await prisma.bet.findMany({
            where: {
                raceId,
                betType: 'RACE',
                contestantId: first,
            },
        })
        const totalBet = wonBets.reduce((acc, bet) => acc + Number(bet.amount), 0)
        let totalWin = 0

        for (const wonBet of wonBets) {
            const wonAmount = await contract.getRaceResult(raceId, wonBet.bettor)
            totalWin += formatAmount(wonAmount)
        }

        await new Promise<void>(resolve => {
            const tryGetResult = async () => {
                const raceResults = await prisma.raceResults.findMany({
                    where: {
                        raceId: _raceId.toString(),
                        lap: undefined,
                    },
                })
                if (raceResults.length === 0) {
                    setTimeout(tryGetResult, 1000)
                    return
                }
                resolve()
            }
            tryGetResult()
        })

        const scoreBoard = (await getScoreboard(prisma)).sort((a, b) => b.overallScore - a.overallScore)
        const totalBets = [] as number[]
        for (const { contestant } of scoreBoard) {
            const c = await prisma.bet.findMany({
                where: {
                    raceId,
                    betType: 'RACE',
                    contestantId: contestant.id,
                },
            })
            const total = c.reduce((acc, bet) => acc + Number(bet.amount), 0)
            totalBets.push(total)
        }

        const numberToEmoji = {
            1: '1️⃣',
            2: '2️⃣',
            3: '3️⃣',
            4: '4️⃣',
            5: '5️⃣',
            6: '6️⃣',
            7: '7️⃣',
            8: '8️⃣',
            9: '9️⃣',
        }

        const text = `
☑️ Race Finished

🔝FULL RACE RESULTS:
${scoreBoard.map((score, i) => {
            return `${numberToEmoji[i + 1]} ${score.contestant.name} - ${score.overallScore} Points / Bet: ${totalBets[i]}${score.contestant.id === first ? ` / Win: ${totalWin}` : ''} DCR`
        }).join('\n')}

        `.trim()
        sendAllMessage(text)
    }
}

for (const [key, handler] of Object.entries(events)) {
    contract.on(key, async (...args) => {
        try {
            //@ts-ignore
            await handler(...args)
        } catch (error) {
            captureError(error)
        }
    })
}

// events.RaceCreatedWithContestants(6, {
//     laps: 3,
//     minBet: BigInt(100000000000000000),
//     maxBet: BigInt(1000000000000000000),
// }, [BigInt(13), BigInt(2), BigInt(3)])
// events.RaceStarted(BigInt(6))
// events.LapFinished(BigInt(6), BigInt(1), BigInt(13), BigInt(2), BigInt(3))
// events.RaceFinished(BigInt(5), BigInt(13))

const formatAmount = (amount: BigInt) => Number(amount) / 10 ** 18
