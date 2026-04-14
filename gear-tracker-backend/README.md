# Gear Tracker Backend

Express + Drizzle backend for the Hardware IEM Manager. It manages IEMs, cables, and the compatibility relationship table that links them.

## Features
- CRUD-style API for IEMs and cable inventory
- Compatibility linking through the `iem_to_cables` relationship table
- Validation with `zod`
- Generated SVG preview images for seeded and created items
- Drizzle ORM with PostgreSQL
- Local hot reload with `tsx watch`
- Docker-friendly development flow

## Project Structure
```text
gear-tracker-backend/
├── drizzle.config.ts
├── package.json
└── src/
    ├── index.ts
    └── db/
        ├── image.ts
        ├── index.ts
        ├── schema.ts
        └── seed.ts
```

## Prerequisites
- Node.js 18+
- PostgreSQL
- Docker and Docker Compose for containerized development

## Environment
Set these when running outside Docker:

- `DATABASE_URL`: PostgreSQL connection string used by Drizzle and the API
- `PORT`: Optional. Defaults to `3001`
- `FRONTEND_URL`: Optional CORS origin. Defaults to `http://localhost:3000`

## Installation
```bash
npm ci
```

## Running

### Local development
```bash
npm run dev
```

API default URL:
```text
http://localhost:3001
```

### Docker Compose
From the repository root:

```bash
docker compose up --build db backend
```

The backend container is expected to run schema push, seed, and dev watch on startup.

## Database

### Push schema
```bash
npm run db:push
```

### Seed data
```bash
npm run db:seed
```

Current seed behavior:
- Clears `iem_to_cables`, `cables`, and `iems`
- Recreates sample IEMs and cables
- Rebuilds compatibility links based on matching connector types

## API Overview

### Health
- `GET /health`

### IEMs
- `GET /iems`
- `GET /iems/:iemId`
- `POST /iems`
- `PATCH /iems/:iemId`
- `DELETE /iems/:iemId`

IEM payload:

```json
{
  "brand": "Moondrop",
  "model": "Blessing 3",
  "connector": "0.78mm"
}
```

IEM update/delete notes:
- Updating connector is blocked if linked cables would become incompatible
- Deleting an IEM also deletes its rows from `iem_to_cables`

### Cables
- `GET /cables`
- `POST /cables`
- `DELETE /cables/:cableId`

Cable payload:

```json
{
  "name": "Effect Audio Ares S",
  "connector": "0.78mm",
  "material": "Copper"
}
```

Cable delete notes:
- Deleting a cable also deletes its rows from `iem_to_cables`

### Compatibility Links
- `POST /iems/:iemId/cables/:cableId`
- `DELETE /iems/:iemId/cables/:cableId`

Compatibility rules:
- IEM and cable must exist
- Connector types must match before a link can be created
- Deleting a link removes a single row from the relationship table

## Scripts
- `npm run dev` — Start the API with watch mode
- `npm run generate` — Generate Drizzle migration files
- `npm run db:push` — Push schema changes to the configured database
- `npm run db:seed` — Reset and seed the database

## Notes
- Item images are generated as inline SVG data URLs in the backend
- CORS is restricted to `FRONTEND_URL`
- API validation errors return `400`; missing records return `404`
