/**
 * Type declarations untuk Cloudflare Workers + nodejs_compat
 *
 * Workers dengan `nodejs_compat` flag menyediakan `process.env` secara runtime.
 * File ini memberi tahu TypeScript bahwa `process.env` itu valid.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string
    JWT_SECRET?: string
    CORS_ORIGIN?: string
  }
}

declare var process: {
  env: NodeJS.ProcessEnv
}
