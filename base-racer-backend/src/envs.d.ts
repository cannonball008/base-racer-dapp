declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URL: string,
        NODE_ENV: "development" | "production"
    }
}
