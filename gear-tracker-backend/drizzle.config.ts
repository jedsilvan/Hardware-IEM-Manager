import { defineConfig } from 'drizzle-kit'

const databaseUrl =
  process.env.DATABASE_URL || 'postgresql://dev_user:dev_password@db:5432/gear_tracker'

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
})
