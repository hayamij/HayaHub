# HayaHub

**An all-in-one personal management hub built with Clean Architecture principles**

HayaHub integrates expense tracking, project management, calendars, todo lists, and wishlists into a single, streamlined dashboard to help you master your life and finances.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Architecture Decisions](#architecture-decisions)
- [Storage Strategy](#storage-strategy)
- [Contributing](#contributing)
- [License](#license)

## Features

### Current Implementation
- User authentication (register/login)
- Expense tracking and management
- Dashboard with spending analytics
- Real-time sync between local storage and GitHub API
- Dark/Light theme support
- Responsive design with mobile support

### Planned Features
- Project management
- Calendar integration
- Todo lists
- Wishlists
- Budget planning
- Financial reports and insights

## Architecture

HayaHub follows **Clean Architecture** principles, ensuring separation of concerns, testability, and maintainability. The codebase is organized into distinct layers with strict dependency rules.

### Clean Architecture Layers

```
┌─────────────────────────────────────────────┐
│     Layer 4: INFRASTRUCTURE                 │
│  (Framework, Storage, External Services)    │
│  - DI Container                             │
│  - Storage Adapters (LocalStorage, GitHub)  │
│  - Repository Implementations               │
└──────────────┬──────────────────────────────┘
               │ implements
               ↓
┌─────────────────────────────────────────────┐
│       Layer 3: ADAPTERS (UI)                │
│  (React Components, Hooks, Presenters)      │
│  - Next.js App Router Pages                 │
│  - React Components                         │
│  - Custom Hooks (useExpenses, useAuth)      │
└──────────────┬──────────────────────────────┘
               │ depends on
               ↓
┌─────────────────────────────────────────────┐
│      Layer 2: BUSINESS LOGIC                │
│  (Use Cases, DTOs, Repository Interfaces)   │
│  - CreateExpenseUseCase                     │
│  - RegisterUserUseCase                      │
│  - IExpenseRepository (Port)                │
└──────────────┬──────────────────────────────┘
               │ depends on
               ↓
┌─────────────────────────────────────────────┐
│        Layer 1: DOMAIN                      │
│  (Entities, Value Objects, Business Rules)  │
│  - Expense, User Entities                   │
│  - Money, Email Value Objects               │
│  - Domain Exceptions                        │
└─────────────────────────────────────────────┘
```

### Dependency Rule

**Dependencies flow inward only:** Infrastructure → Adapters → Business → Domain

- Domain has ZERO dependencies (pure TypeScript)
- Business depends only on Domain
- Adapters depend on Business + Domain
- Infrastructure implements interfaces from Business

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Component Library**: Shadcn/UI (Radix UI primitives)
- **Icons**: Lucide React
- **Theme**: next-themes

### Backend
- **API**: Next.js API Routes (Node.js)
- **Storage**: Hybrid strategy (LocalStorage + GitHub API)
- **Architecture**: Clean Architecture pattern
- **DI**: Custom Dependency Injection Container

### Development Tools
- **Monorepo**: Turborepo
- **Package Manager**: npm/pnpm workspaces
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Vitest

## Project Structure

```
HayaHub/
├── apps/
│   └── web/                    # Next.js frontend application
│       ├── src/
│       │   ├── app/           # Next.js App Router pages
│       │   ├── components/    # React components
│       │   ├── hooks/         # Custom React hooks
│       │   ├── contexts/      # React contexts
│       │   ├── infrastructure/
│       │   │   ├── di/        # Dependency Injection
│       │   │   ├── storage/   # Storage adapters
│       │   │   └── repositories/  # Repository implementations
│       │   └── lib/           # Utilities
│       └── package.json
│
├── packages/
│   ├── domain/                # Domain layer (Layer 1)
│   │   ├── src/
│   │   │   ├── entities/      # Business entities
│   │   │   ├── value-objects/ # Value objects (Money, Email)
│   │   │   ├── enums/         # Domain enums
│   │   │   └── exceptions/    # Domain exceptions
│   │   └── package.json
│   │
│   ├── business/              # Business layer (Layer 2)
│   │   ├── src/
│   │   │   ├── use-cases/     # Application use cases
│   │   │   ├── dtos/          # Data transfer objects
│   │   │   └── ports/         # Repository interfaces
│   │   └── package.json
│   │
│   └── shared/                # Shared utilities
│       └── src/
│
├── materials/                 # Documentation
│   ├── ARCHITECTURE_AUDIT_REPORT.md
│   ├── architecture.md
│   ├── context.txt
│   └── mega-prompt.md
│
├── turbo.json                 # Turborepo configuration
├── package.json               # Root package configuration
└── tsconfig.base.json         # Shared TypeScript config
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hayamij/HayaHub.git
cd HayaHub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local in apps/web/
cp apps/web/.env.example apps/web/.env.local
```

Required environment variables:
```env
NEXT_PUBLIC_GITHUB_TOKEN=your_github_personal_access_token
NEXT_PUBLIC_GITHUB_REPO=your_username/your_repo
```

4. Build packages:
```bash
npm run build
```

### Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm run start
```

The application will be available at `http://localhost:3000`

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build all packages and applications
- `npm run lint` - Run ESLint across all workspaces
- `npm run test` - Run tests in all packages
- `npm run type-check` - TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean build artifacts and node_modules

### Development Workflow

1. **Domain Layer First**: Define entities and business rules in `packages/domain`
2. **Business Use Cases**: Implement use cases in `packages/business`
3. **Infrastructure**: Create adapters in `apps/web/src/infrastructure`
4. **UI Components**: Build React components in `apps/web/src/components`
5. **Custom Hooks**: Create hooks in `apps/web/src/hooks` to connect UI with business logic

### Code Quality Standards

- **TypeScript strict mode**: All code must pass strict type checking
- **No framework dependencies in Domain/Business**: Pure TypeScript only
- **Dependency Rule**: Never reverse layer dependencies
- **Testing**: Write unit tests for domain entities and use cases
- **Formatting**: All code must be formatted with Prettier

## Testing

Run tests:
```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# With UI
npm run test:ui
```

Testing strategy:
- **Domain Layer**: Test business logic in isolation
- **Business Layer**: Test use cases with mocked repositories
- **Adapters**: Test repository implementations with in-memory storage
- **UI Components**: Test rendering and user interactions

## Architecture Decisions

### Strategy Pattern for Storage

HayaHub uses the Strategy Pattern to abstract storage implementations:

```typescript
// Primary storage: Fast, local access
LocalStorageStrategy (Browser LocalStorage)

// Secondary storage: Persistent, remote sync
GitHubStorageStrategy (GitHub API)

// Hybrid: Best of both worlds
HybridStorageAdapter combines both strategies
```

### Custom Hooks Layer

To decouple UI components from business logic, custom hooks encapsulate use case interactions:

```typescript
// Instead of calling Container directly:
const expenses = await Container.getExpensesUseCase().execute(...)

// Use custom hooks:
const { expenses, isLoading, error, refetch } = useExpenses({
  userId: user.id,
  startDate,
  endDate
})
```

Benefits:
- Easier testing (mock hooks instead of use cases)
- Better separation of concerns
- Reusable data fetching logic
- Automatic state management (loading, error, data)

### Dependency Injection

A singleton Container manages all dependencies:

```typescript
Container.getInstance().getExpensesUseCase()
```

This ensures:
- Single instance of each service
- Proper dependency wiring
- Easy to swap implementations
- Lazy initialization

## Storage Strategy

### Hybrid Storage Architecture

HayaHub uses a hybrid approach combining local and remote storage:

1. **LocalStorage (Primary)**
   - Fast access for reads/writes
   - Works offline
   - Limited to 5-10MB

2. **GitHub API (Secondary)**
   - Persistent storage
   - Accessible from any device
   - Unlimited capacity
   - Requires internet connection

3. **Automatic Sync**
   - Background sync every 30 seconds
   - Smart sync: Only syncs differences
   - Conflict resolution: Last write wins
   - Auto-refresh after login

### Data Flow

```
User Action → LocalStorage (instant) → Sync Queue → GitHub API (background)
                                                          ↓
                                               On Login: GitHub → LocalStorage
```

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow Clean Architecture principles
4. Write tests for new features
5. Ensure all tests pass (`npm run test`)
6. Run type checking (`npm run type-check`)
7. Format code (`npm run format`)
8. Commit changes (`git commit -m 'Add amazing feature'`)
9. Push to branch (`git push origin feature/amazing-feature`)
10. Open a Pull Request

### Code Review Checklist

- [ ] Domain entities have no framework dependencies
- [ ] Business use cases only depend on Domain and Ports
- [ ] UI components use custom hooks instead of calling Container directly
- [ ] All interfaces are defined in Business layer
- [ ] Tests are included and passing
- [ ] TypeScript strict mode is satisfied
- [ ] Code is formatted with Prettier

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Nguyen Quang Tuan Phuong

## Acknowledgments

- Clean Architecture by Robert C. Martin
- Hexagonal Architecture (Ports and Adapters)
- Domain-Driven Design principles
- Next.js and React teams for excellent frameworks

---

Built with passion by [hayamij](https://github.com/hayamij)
