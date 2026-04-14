# Gear Tracker Frontend

Next.js frontend for the Hardware IEM Manager. It presents IEMs, cables, compatibility links, and management actions for creating, editing, unlinking, and deleting items.

## Stack
- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Radix Alert Dialog via shadcn-style wrapper
- `lucide-react` icons

## Features
- Dashboard with separate IEM and cable sections
- IEM detail page with compatible cable cards
- Create IEM flow with compatibility preselection
- Edit IEM flow
- Create cable flow
- Delete confirmations for IEMs and cables using Alert Dialog
- Relationship unlinking for removing a cable from an IEM
- Connector-aware accent colors while keeping connector badge colors intact

## Routes
- `/` — Dashboard
- `/iems/new` — Add IEM
- `/iems/[id]` — IEM detail page
- `/iems/[id]/edit` — Edit IEM
- `/cables/new` — Add cable

## Project Structure
```text
gear-tracker-frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── cables/
│   │   └── new/
│   │       └── page.tsx
│   └── iems/
│       ├── new/
│       │   └── page.tsx
│       └── [id]/
│           ├── page.tsx
│           └── edit/
│               └── page.tsx
├── components/
│   ├── connector-badge.tsx
│   ├── delete-cable-button.tsx
│   ├── delete-iem-button.tsx
│   ├── unlink-cable-button.tsx
│   └── ui/
│       └── alert-dialog.tsx
├── lib/
│   ├── api.ts
│   ├── cable-accent.ts
│   └── utils.ts
└── styles/
	└── globals.css
```

## API Integration
The frontend expects the backend API at:

```text
http://localhost:3001
```

Server-side requests can be redirected with:

- `API_INTERNAL_URL`

Current default behavior in `lib/api.ts`:
- Browser requests use `http://localhost:3001`
- Server requests use `API_INTERNAL_URL` if provided, otherwise the same localhost URL

## Getting Started

### Install dependencies
```bash
npm ci
```

### Run locally
```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts
- `npm run dev` — Start Next.js in development mode
- `npm run build` — Build the app
- `npm run start` — Start the production server
- `npm run lint` — Run ESLint
- `npm run format` — Format the project with Prettier
- `npm run format:check` — Check formatting with Prettier

## UI Notes
- Connector badges keep fixed connector-type colors
- Card accents for cable-related UI are aligned through shared connector accent mapping
- Destructive actions use the shared Alert Dialog component in `components/ui/alert-dialog.tsx`

## Development Notes
- The dashboard only renders items with images on the main grid views
- Delete actions call the backend and then refresh or navigate the UI
- Unlinking a cable removes a single row from the compatibility relationship table

## Known Gaps
- There is currently no dedicated cable detail page
- There is currently no cable edit route in the active route tree
