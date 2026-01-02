# HostingAllTV - Streaming Platform

## Overview

HostingAllTV is a premium streaming platform for movies and TV series, inspired by Netflix, Disney+, and HBO Max. The application provides a cinematic, dark-themed user experience with features like hero carousels, content rails, video playback, and an admin dashboard for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

### Recent Changes (2026-01-01)
- **Deployment Fix**: Moved `tsx`, `typescript`, and `esbuild` to production dependencies to resolve Render build failures (`tsx: not found`).
- **Security**: Migrated all sample video URLs from HTTP to HTTPS to prevent Mixed Content blocking.
- **UI Enhancements**: Updated "Play Now" buttons to a transparent glass-morphism style.
- **Video Player**: Improved mobile compatibility with a dedicated close button.
- **UI Tweaks**: Attempted to hide the platform badge via CSS workaround.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with custom design tokens defined in CSS variables
- **UI Components**: Shadcn/ui (Radix UI primitives with custom styling)
- **Animations**: Framer Motion for smooth transitions
- **Carousels**: Embla Carousel for horizontal content scrollers
- **Video Player**: Video.js for media playback

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ES modules)
- **API Pattern**: RESTful endpoints defined in `shared/routes.ts`
- **Build Tool**: Custom build script using tsx and Vite

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Tables**: movies, series, episodes, activeUsers, streamViews

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks (use-movies, use-series)
│   │   ├── lib/          # Utilities (queryClient, SEO helpers)
│   │   └── pages/        # Route pages (Home, Movies, Series, Search, Admin)
├── server/           # Express backend
│   ├── db.ts         # Database connection
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Data access layer
│   └── index.ts      # Server entry point
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod validation
```

### Key Design Decisions

1. **Shared Schema Pattern**: Database schema and API route definitions live in `/shared` directory, allowing type-safe communication between frontend and backend.

2. **Storage Abstraction**: The `IStorage` interface in `server/storage.ts` abstracts database operations, making it easy to swap implementations.

3. **Component-Based UI**: Custom components like `HeroCarousel`, `ContentRow`, and `VideoPlayer` encapsulate streaming platform patterns.

4. **Admin Panel**: Separate admin routes under `/server/admin` for content management with dedicated layout component.

5. **SEO Optimization**: Dynamic meta tag updates via `lib/seo.ts` for better search engine visibility.

## External Dependencies

### Database
- **PostgreSQL**: Primary database (connection via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations and schema push (`npm run db:push`)

### Frontend Libraries
- **@tanstack/react-query**: Data fetching and caching
- **video.js**: Video playback functionality
- **embla-carousel-react**: Carousel/slider functionality
- **framer-motion**: Animation library
- **lucide-react**: Icon library

### UI Framework
- **Radix UI**: Accessible UI primitives (dialog, dropdown, tabs, etc.)
- **Tailwind CSS**: Utility-first styling
- **class-variance-authority**: Component variant management

### Build & Development
- **Vite**: Frontend bundler with HMR
- **tsx**: TypeScript execution for development
- **Replit plugins**: Dev banner and cartographer for Replit environment