# Gear Tracker

**Gear Tracker** is a full-stack application for managing your audio hardware collection, including IEMs (In-Ear Monitors), cables, and source gear. It features a modern Next.js frontend, a Node.js backend with Drizzle ORM, and a PostgreSQL database—all orchestrated with Docker Compose.

## Features
- List, add, edit, and delete IEMs, cables, and gear
- Many-to-many relationship management (e.g., cables compatible with multiple IEMs)
- Compatibility checker logic enforced on the backend
- Modern UI with Next.js and Tailwind CSS
- Easy local development with Docker Compose

## Project Structure

```
├── gear-tracker-backend/   # Node.js backend (Drizzle ORM, Express)
├── gear-tracker-frontend/  # Next.js frontend
├── docker-compose.yml      # Multi-service orchestration
└── README.md               # Project overview (this file)
```

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- Node.js (for local development, v20+ recommended)


### Quick Start (Recommended)


## Development

- Backend: see `gear-tracker-backend/README.md`
- Frontend: see `gear-tracker-frontend/README.md`

## Tech Stack
- Next.js, React, Tailwind CSS (Frontend)
- Node.js, Drizzle ORM, Express (Backend)
- PostgreSQL (Database)
- Docker Compose (Orchestration)

## License
MIT