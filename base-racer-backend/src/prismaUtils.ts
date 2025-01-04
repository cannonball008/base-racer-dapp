// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

export const upsertWithoutId = async (model, where, commonData) => {
    const existingRecord = await model.findFirst({ where })
    if (existingRecord) {
        await model.update({
            where: {
                id: existingRecord.id,
            },
            data: {
                ...commonData,
            },
        })
    } else {
        await model.create({
            data: {...commonData,}
        })
    }
}
