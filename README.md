# Event Manager

An event management application built with Next.js, Prisma, and PostgreSQL. Create events, manage capacity, and register attendees with real-time updates.


## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Neon) with Prisma ORM
- **UI:** Shadcn UI, Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form with Zod validation
- **Notifications:** Sonner
- **Language:** TypeScript

## Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd event-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host/dbname?sslmode=require"
```

> **Note:** If using Vercel Postgres (Neon), these variables are automatically provided.

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

- **Event**: `id`, `title`, `date`, `description`, `capacity`, `createdAt`
- **Attendee**: `id`, `name`, `email`, `eventId` (unique constraint on `email` + `eventId`)

## API Routes

- `GET /api/events` - Fetch all events with attendee counts
- `POST /api/events` - Create a new event
- `POST /api/events/[id]/register` - Register an attendee for an event

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `POSTGRES_URL_NON_POOLING` (optional, for transactions)
4. Deploy!

The `postinstall` script automatically generates Prisma Client during deployment.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
