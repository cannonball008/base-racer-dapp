import got from 'got'
import * as fs from 'fs'

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const apolloErrorFile = join(
    __dirname,
    '../src/generated-apolloError.ts',
)

export const generateErrorFile = async () => {
    const { body } = await got(
        'https://github.com/apollographql/apollo-server/raw/main/docs/source/data/errors.mdx',
    )

    const partWithErrors = body.slice(body.indexOf('## Built-in error codes'))

    const matches = Array.from(partWithErrors.matchAll(/###### `(.+?)`/g))

    const generatedErrorsFile = `
export interface ApolloError {
    extensions: {
        code: ApolloErrorCode
    },
    message: string
}

type ApolloErrorCode = string
    ${matches
        .map(({ 1: value, 2: serverMethod }) => {
            return `${
                serverMethod
                    ? `\n/** Can be thrown on server using \`${serverMethod}\` */`
                    : ''
            }\n| "${value}"`
        })
        .join('')}
`

    await fs.promises.writeFile(apolloErrorFile, generatedErrorsFile, 'utf-8')
}
