import * as path from 'path'
import { GraphQLBigInt, GraphQLNonEmptyString, 	GraphQLDateTime } from 'graphql-scalars'
import { asNexusMethod, connectionPlugin, makeSchema } from 'nexus'

import * as types from './graphql'

const customScalars = {
    userId: asNexusMethod(GraphQLBigInt, 'userId'),
    nonEmptyString: asNexusMethod(GraphQLNonEmptyString, 'nonEmptyString'),
    DateTime: asNexusMethod(GraphQLDateTime, 'DateTime'),
}

const devOutputs = process.env.GEN_OUTPUTS

export const schema = makeSchema({
    sourceTypes: devOutputs
        ? {
              modules: [
                  // {
                  //     module: require.resolve("./rootTypes"),
                  //     alias: "RootTypes"
                  // }
              ],
          }
        : undefined,
    contextType: devOutputs
        ? {
              module: require.resolve('./context'),
              export: 'Context',
          }
        : undefined,
    outputs: devOutputs
        ? {
              schema: path.join(__dirname, '../api.graphql'),
              // TODO generate into package when:
              // 1. TypeScript would be smart enough to detect changes from generated package (immediately)
              // 2. Vite can detect changes and rebuild package (read docs)
              // 3. Yarn would be smart enough to not erase generated package
              typegen: path.join(__dirname, './generated-nexus.d.ts'),
          }
        : undefined,
    nonNullDefaults: {
        input: true,
        output: true,
    },
    types: {
        ...types,
        ...customScalars,
    },
    plugins: [connectionPlugin({})],
})
