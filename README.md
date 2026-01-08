# HayaHub

**Personal management hub with Clean Architecture** - Integrates expense tracking, project management, calendar, todo lists, and wishlists in a single application.

## Overview

HayaHub is a comprehensive personal management platform built following Clean Architecture principles, ensuring high maintainability, scalability, and testability. The project combines local storage (fast) and GitHub API (remote sync) to deliver an optimal experience.

### Features
- Expense tracking with spending analytics
- Auto-sync LocalStorage ↔ GitHub
- Dark/Light theme
- Project management, Calendar, Todo lists, Wishlists

### Tech Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + Shadcn/UI
- **Storage**: Hybrid (LocalStorage + GitHub API)
- **Architecture**: Clean Architecture với DI Container

## Architecture

### Clean Architecture Layers

```
Infrastructure (Next.js, Storage, DI)
        ↓ implements
Adapters (React Components, Hooks)
        ↓ depends on
Business Logic (Use Cases, Ports)
        ↓ depends on
Domain (Entities, Value Objects)
```

**Dependency Rule**: Dependencies only flow inward (Infrastructure → Adapters → Business → Domain)

### Project Structure

```
HayaHub/
├── apps/web/                      # Next.js app
│   └── src/
│       ├── app/                   # Pages
│       ├── components/            # UI components
│       ├── hooks/                 # Custom hooks
│       └── infrastructure/        # DI, Storage, Repos
│
└── packages/
    ├── domain/                    # Entities, Value Objects
    ├── business/                  # Use Cases, DTOs, Ports
    └── shared/                    # Utilities
```

## Developer Guide

### Installation

```bash
# Clone & install
git clone https://github.com/hayamij/HayaHub.git
cd HayaHub
npm install

# Setup environment
cp apps/web/.env.example apps/web/.env.local
# Add NEXT_PUBLIC_GITHUB_TOKEN and NEXT_PUBLIC_GITHUB_REPO

# Build & run
npm run build
npm run dev  # → http://localhost:3000
```

### Development Workflow

1. **Domain First**: Define entities in `packages/domain`
2. **Use Cases**: Implement logic in `packages/business`
3. **Infrastructure**: Create adapters in `apps/web/src/infrastructure`
4. **UI**: Build components and hooks in `apps/web/src`

### Code Rules

- TypeScript strict mode
- Domain/Business MUST NOT import frameworks (React, Next.js)
- UI components use custom hooks instead of calling Container directly
- Tests for entities and use cases
- Format code with Prettier

### Essential Scripts

```bash
npm run dev          # Development
npm run build        # Production build
npm run test         # Run tests
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## Storage Strategy

**Hybrid Architecture**: LocalStorage (fast, offline) + GitHub API (persistent, multi-device)

```
User Action → LocalStorage (instant)
                  ↓
            Sync Queue (30s)
                  ↓
            GitHub API (background)
```

- Auto-sync every 30s
- Conflict resolution: Last write wins
- Auto-refresh after login

## License

MIT License - Copyright (c) 2026 Nguyen Quang Tuan Phuong

---

Built by [hayamij](https://github.com/hayamij) |