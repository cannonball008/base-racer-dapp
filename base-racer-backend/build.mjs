import { build } from 'esbuild'
import { sentryEsbuildPlugin } from '@sentry/esbuild-plugin'

await build({
    bundle: true,
    platform: 'node',
    minify: true,
    outdir: 'out',
    entryPoints: ['src/index.ts'],
    logOverride: {
        'require-resolve-not-external': 'debug'
    },
    define: {
        'process.env.NODE_ENV': "'production'",
    },
    external: [
        // --external:@prisma/client --external:nexus-prisma
        '@prisma/client',
        'nexus-prisma',
    ],
    plugins: [
        sentryEsbuildPlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: "zardoy",
            project: "dcr-backend",
        })
    ],
    sourcemap: true,
})
