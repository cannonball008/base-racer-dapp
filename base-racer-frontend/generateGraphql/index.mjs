import fsExtra from 'fs-extra'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'

import { generate } from '@graphql-codegen/cli'

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import * as yaml from 'js-yaml'
import replaceInFile from 'replace-in-file'
import { apolloErrorFile, generateErrorFile } from './generateApolloError.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// const moduleName = ".graphql-operations"

// const packageFile = join(__dirname, `../node_modules/${moduleName}/package.json`)

// await fsExtra.ensureFile(packageFile)

// await jsonfile.writeFile(packageFile, {
//     name: moduleName,
//     version: "0.0.0-generated",
//     main: "index.ts"
// })

// TODO generate into package when:
// 1. TypeScript server language would be smart enough to detect changes from generated package (immediately)
// 2. Vite setup (optimizeDeps.exclude)
// 3. Yarn would be smart enough to not erase generated package
// 4. VSCode doesn't see exported operations (because of 1.)

const mainGeneratedFile = join(__dirname, '../src/generated-operations.ts')

const generateConfig = yaml.load(
    await readFile(join(__dirname, 'codegen.yml'), 'utf8'),
).generates.default

await generate({
    schema: join(__dirname, '../../racing-backend/api.graphql'),
    documents: join(__dirname, '../src/graphql/*.graphql'),
    generates: {
        [mainGeneratedFile]: generateConfig,
    },
})

// TODO create NPM package replace-in-file-all
await replaceInFile.replaceInFile({
    files: [mainGeneratedFile],
    from: /Exact<{ \[key: string\]: never; }>/g,
    to: 'void',
})

if (!existsSync(apolloErrorFile)) await generateErrorFile()
