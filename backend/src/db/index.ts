import { neon } from '@neondatabase/serverless'

/**
 * Database connection using Neon serverless driver
 * Compatible with Cloudflare Workers (via nodejs_compat flag)
 *
 * DATABASE_URL di-set melalui:
 *   - Local dev:  .dev.vars
 *   - Production: `npx wrangler secret put DATABASE_URL`
 */
function getSql() {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error(
      'DATABASE_URL environment variable is required.\n' +
      '  Local: set di .dev.vars\n' +
      '  Prod:  npx wrangler secret put DATABASE_URL'
    )
  }

  return neon(url)
}

export const sql = getSql()
