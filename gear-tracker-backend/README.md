# Gear Tracker Backend

This is the backend service for the Gear Tracker application. It manages hardware inventory, IEM (In-Ear Monitor) assignments, and related data.

## Features
- RESTful API for managing gear and assignments
- Database integration (configured via Drizzle ORM)
- Seed scripts for populating initial data
- Docker Compose support for easy development

## Project Structure
```
gear-tracker-backend/
├── docker-compose.yml         # Docker Compose configuration
├── drizzle.config.ts          # Drizzle ORM configuration
├── package.json               # Node.js dependencies and scripts
└── src/
    ├── index.ts               # Application entry point
    └── db/
        ├── index.ts           # Database connection setup
        ├── schema.ts          # Database schema definitions
        └── seed.ts            # Database seeding script
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Docker & Docker Compose (for containerized setup)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables as needed.

### Running the Backend
- **Locally:**
  ```bash
  npm run dev
  ```
- **With Docker Compose:**
  ```bash
  docker-compose up --build
  ```

### Database Seeding
To seed the database with initial data:
```bash
npm run seed
```

## Scripts
- `npm run dev` — Start the backend in development mode
- `npm run build` — Build the project
- `npm run start` — Start the backend in production mode
- `npm run seed` — Seed the database

## License
MIT
