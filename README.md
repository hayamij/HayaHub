# 🌟 HayaHub

<div align="center">

**All-in-One Personal Management Hub with Enterprise-Grade Architecture**

A modern, full-featured productivity platform built with Clean Architecture, Domain-Driven Design, and cutting-edge React patterns.

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Statistics](#-project-statistics)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Design Patterns](#-design-patterns)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**HayaHub** is a comprehensive personal management platform that combines expense tracking, project management, calendar organization, subscription monitoring, and more into a single, cohesive application. Built with enterprise-grade architecture principles, it demonstrates best practices in modern web development.

### Why HayaHub?

- **🏗️ Clean Architecture**: Strict layer separation (Domain → Business → Infrastructure → Adapters)
- **📦 Monorepo**: Organized with Turborepo for efficient builds and scalability
- **🎨 Modern UI**: Beautiful, responsive interface built with Next.js 15 and TailwindCSS
- **💾 Hybrid Storage**: Strategy Pattern implementation for local + remote persistence
- **🔄 Offline-First**: Works seamlessly offline with background sync
- **♻️ Code Reusability**: Generic hooks and mappers eliminate duplication (~900 LOC saved)
- **🧪 Type-Safe**: Full TypeScript coverage with strict mode
- **🚀 Performance**: Optimized with React 18 patterns and Next.js optimizations

---

## ✨ Features

### 📊 Expense Management
- Track income and expenses with categories
- Date range filtering and search
- Statistical analysis (daily, weekly, monthly)
- Expense presets for quick entry
- Real-time aggregations and insights

### 📅 Calendar & Events
- Visual calendar with month/week/day views
- Create, edit, and delete events
- Event categories and descriptions
- Dashboard widget integration

### 💰 Subscription Tracking
- Monitor recurring subscriptions
- Payment cycle management
- Cost analysis and reminders
- Active/inactive status tracking

### 📝 Projects & Tasks
- Project organization with descriptions
- Task management per project
- Progress tracking
- Deadline management

### 🌟 Wishlist
- Item wishlist with priority levels
- Price tracking
- URL links to products
- Dashboard quick access

### 💬 Daily Quotes
- Inspirational quote management
- Random quote display
- Category organization
- Dashboard widget

### 📸 Photo Gallery
- Cloudinary integration for photo storage
- Upload and manage photos
- Caption editing
- Optimized image delivery

### 🎨 User Experience
- Dark/Light theme support
- Responsive design (mobile, tablet, desktop)
- Real-time sync status indicator
- Error handling with toast notifications
- Offline-first architecture

---

## 🏛️ Architecture

HayaHub follows **Clean Architecture** principles with **Domain-Driven Design (DDD)** patterns, organized into distinct layers:

```
┌─────────────────────────────────────────────────────────────┐
│                     Web App (Next.js)                       │
│                    Adapters Layer                           │
│  - Pages, Components, Hooks                                 │
│  - UI State Management                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                      │
│  - Repositories (Adapters)                                  │
│  - Storage Strategies (Local, GitHub, Cloudinary)          │
│  - Dependency Injection Container                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Business Layer                          │
│  - Use Cases (46 total)                                     │
│  - DTOs & Mappers (11 mappers)                             │
│  - Application Logic                                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                           │
│  - Entities (12 total)                                      │
│  - Value Objects                                            │
│  - Domain Rules & Validation                                │
│  - Business Exceptions                                      │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### 🎯 Domain Layer (`packages/domain`)
- **Pure business logic** with zero external dependencies
- Core entities: `User`, `Expense`, `Project`, `Subscription`, `CalendarEvent`, etc.
- Value objects for type safety and validation
- Domain-specific exceptions

#### 💼 Business Layer (`packages/business`)
- **Use cases** implementing application workflows
- **DTOs** for data transfer between layers
- **Mappers** (BaseMapper pattern) for Entity ↔ DTO conversion
- **Ports** (interfaces) for repository contracts

#### 🏗️ Infrastructure Layer (`apps/web/src/infrastructure`)
- **Repository Adapters** implementing business layer ports
- **Hybrid Storage** with Strategy Pattern (local + remote)
- **DI Container** for dependency management
- Storage strategies: LocalStorage, GitHub API, Cloudinary

#### 🎨 Adapters Layer (`apps/web/src`)
- **Next.js pages** and routing
- **React components** with Tailwind styling
- **Custom hooks** for state management (31+ hooks)
- **Contexts** for global state (Auth, Toast, Sync)

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18.3** - UI library with concurrent features
- **TypeScript 5.3** - Type-safe development
- **TailwindCSS 3.4** - Utility-first styling
- **Lucide React** - Modern icon library
- **next-themes** - Dark mode support

### Build & Development
- **Turborepo** - Monorepo build system
- **pnpm** - Fast package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework

### Storage & APIs
- **LocalStorage** - Primary local cache
- **GitHub API** - Secondary persistent storage
- **Cloudinary** - Photo storage and CDN

### Architecture Patterns
- Clean Architecture
- Domain-Driven Design (DDD)
- Strategy Pattern (storage strategies)
- Repository Pattern (data access)
- Dependency Injection (DI Container)
- Mapper Pattern (entity-dto conversion)
- Generic CRUD Pattern (hooks)

---

## 📊 Project Statistics

### Codebase Metrics
- **46 Use Cases** - Complete CRUD operations for all entities
- **12 Domain Entities** - Core business objects
- **11 Mappers** - Entity ↔ DTO conversion
- **31+ Custom Hooks** - Reusable React logic
- **12 Repository Adapters** - Data persistence
- **~900 Lines Eliminated** - Through pattern reuse
  - ~400 LOC via Mapper Pattern
  - ~500 LOC via Generic CRUD Hook

### Domain Entities
```
User, UserSettings, Expense, ExpensePreset, Subscription, 
CalendarEvent, Quote, Project, Task, WishItem, 
DashboardWidget, Photo
```

### Use Case Categories
- **Expense**: 8 use cases (CRUD + Presets)
- **User**: 6 use cases (Auth + Settings)
- **Calendar**: 4 use cases
- **Project/Task**: 8 use cases
- **Subscription**: 4 use cases
- **Wishlist**: 4 use cases
- **Quote**: 4 use cases
- **Photo**: 5 use cases
- **Dashboard**: 3 use cases

---

## 📁 Project Structure

```
HayaHub/
├── apps/
│   └── web/                          # Next.js application
│       ├── src/
│       │   ├── app/                  # App router pages
│       │   │   ├── dashboard/        # Main dashboard
│       │   │   ├── expenses/         # Expense management
│       │   │   ├── calendar/         # Calendar view
│       │   │   ├── projects/         # Project management
│       │   │   ├── subscriptions/    # Subscription tracker
│       │   │   ├── wishlist/         # Wishlist management
│       │   │   ├── photos/           # Photo gallery
│       │   │   ├── quote/            # Quote management
│       │   │   ├── login/            # Authentication
│       │   │   └── register/         # User registration
│       │   ├── components/           # React components
│       │   │   ├── ui/               # Reusable UI components
│       │   │   ├── dashboard/        # Dashboard widgets
│       │   │   ├── layout/           # Layout components
│       │   │   └── ...               # Feature components
│       │   ├── hooks/                # Custom React hooks
│       │   │   ├── useEntityCRUD.ts  # Generic CRUD hook
│       │   │   ├── useExpenses.ts    # Expense management
│       │   │   ├── useProjects.ts    # Project management
│       │   │   └── ...               # 28+ more hooks
│       │   ├── infrastructure/       # Infrastructure layer
│       │   │   ├── di/               # Dependency injection
│       │   │   │   └── Container.ts  # DI container
│       │   │   ├── repositories/     # Repository adapters
│       │   │   └── storage/          # Storage strategies
│       │   │       ├── HybridStorageAdapter.ts
│       │   │       └── strategies/
│       │   │           ├── LocalStorageStrategy.ts
│       │   │           ├── GitHubStorageStrategy.ts
│       │   │           └── IStorageStrategy.ts
│       │   ├── contexts/             # React contexts
│       │   │   ├── AuthContext.tsx
│       │   │   └── ToastContext.tsx
│       │   └── lib/                  # Utilities
│       ├── next.config.js
│       ├── tailwind.config.js
│       └── package.json
│
├── packages/
│   ├── domain/                       # Domain layer
│   │   └── src/
│   │       ├── entities/             # 12 domain entities
│   │       ├── value-objects/        # Value objects
│   │       ├── enums/                # Enumerations
│   │       └── exceptions/           # Domain exceptions
│   │
│   ├── business/                     # Business layer
│   │   └── src/
│   │       ├── use-cases/            # 46 use cases
│   │       │   ├── expense/
│   │       │   ├── user/
│   │       │   ├── calendar/
│   │       │   ├── project/
│   │       │   ├── task/
│   │       │   ├── subscription/
│   │       │   ├── wishlist/
│   │       │   ├── quote/
│   │       │   ├── photo/
│   │       │   └── dashboardWidget/
│   │       ├── dtos/                 # Data transfer objects
│   │       ├── mappers/              # 11 mappers
│   │       │   ├── BaseMapper.ts     # Generic mapper base
│   │       │   └── ...               # Entity-specific mappers
│   │       └── ports/                # Repository interfaces
│   │
│   └── shared/                       # Shared utilities
│       └── src/
│           ├── types/                # Shared types
│           └── utils/                # Utility functions
│
├── docs/                             # Documentation
│   └── assets/
│       └── images/                   # Screenshots
│
├── scripts/                          # Utility scripts
├── turbo.json                        # Turborepo config
├── pnpm-workspace.yaml               # pnpm workspace config
├── tsconfig.base.json                # Base TypeScript config
└── package.json                      # Root package.json
```

---

## 📸 Screenshots

### Dashboard
![Dashboard 1](docs/assets/images/dashboard1.png)
*Main dashboard with widgets and statistics*

![Dashboard 2](docs/assets/images/dashboard2.png)
*Dashboard with expense tracking overview*

### Expense Management
![Spending](docs/assets/images/spending.png)
*Expense tracking with filters and statistics*

### Calendar
![Calendar](docs/assets/images/calendar.png)
*Calendar view with event management*

### Subscriptions
![Subscriptions](docs/assets/images/subscriptions.png)
*Subscription tracking and management*

### Additional Features
![Quotes](docs/assets/images/quotes.png)
*Quote management interface*

![Photos](docs/assets/images/photos.png)
*Photo gallery with Cloudinary integration*

![Wishlist](docs/assets/images/wishlist.png)
*Wishlist management*

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm >= 9.0.0
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/hayamij/HayaHub.git
cd HayaHub
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Set up environment variables**

Create `.env.local` in `apps/web/`:
```env
# GitHub Storage (Optional)
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
NEXT_PUBLIC_GITHUB_OWNER=your_username
NEXT_PUBLIC_GITHUB_REPO=your_repo_name

# Cloudinary (For photo uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Start development server**
```bash
pnpm dev
# or
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

### First Time Setup

1. Navigate to `/register` to create an account
2. Login with your credentials
3. Start managing your expenses, projects, and more!

---

## 💻 Development

### Available Scripts

```bash
# Development (all packages)
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint

# Run tests
pnpm test

# Clean build artifacts
pnpm clean

# Format code
pnpm format
```

### Turborepo Commands

```bash
# Build specific package
turbo build --filter=hayahub-web

# Run tests in watch mode
turbo test:watch --filter=hayahub-domain

# Type check all packages
turbo type-check
```

### Project Workflows

#### Adding a New Feature

1. **Define Domain Entity** (`packages/domain/src/entities/`)
```typescript
export class MyEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    // ... other properties
  ) {}
}
```

2. **Create DTO** (`packages/business/src/dtos/`)
```typescript
export interface MyEntityDTO {
  id: string;
  userId: string;
  // ... matching properties
}
```

3. **Create Mapper** (`packages/business/src/mappers/`)
```typescript
export class MyEntityMapper extends BaseMapper<MyEntity, MyEntityDTO> {
  toDTO(entity: MyEntity): MyEntityDTO {
    return { id: entity.id, userId: entity.userId };
  }
  
  toDomain(dto: MyEntityDTO): MyEntity {
    return new MyEntity(dto.id, dto.userId);
  }
}
```

4. **Define Repository Port** (`packages/business/src/ports/`)
```typescript
export interface IMyEntityRepository {
  getAll(userId: string): Promise<Result<MyEntity[]>>;
  // ... other methods
}
```

5. **Create Use Cases** (`packages/business/src/use-cases/myEntity/`)
```typescript
export class GetMyEntitiesUseCase {
  constructor(private repo: IMyEntityRepository) {}
  
  async execute(userId: string): Promise<Result<MyEntityDTO[]>> {
    // ... implementation
  }
}
```

6. **Implement Repository** (`apps/web/src/infrastructure/repositories/`)
```typescript
export class MyEntityRepositoryAdapter implements IMyEntityRepository {
  // ... implementation
}
```

7. **Register in DI Container** (`apps/web/src/infrastructure/di/Container.ts`)
```typescript
get getMyEntitiesUseCase(): GetMyEntitiesUseCase {
  return new GetMyEntitiesUseCase(this.myEntityRepository);
}
```

8. **Create Custom Hook** (`apps/web/src/hooks/`)
```typescript
export function useMyEntities(userId: string) {
  const getUseCase = useMemo(() => container.getMyEntitiesUseCase, []);
  
  return useEntityCRUD<MyEntityDTO, ...>({
    getUseCase,
    getParams: userId,
  });
}
```

9. **Build UI Components** (`apps/web/src/components/` and `apps/web/src/app/`)

---

## 🎨 Design Patterns

### 1. **Mapper Pattern** (BaseMapper)

Eliminates ~400 lines of repetitive entity-DTO conversion code.

```typescript
// packages/business/src/mappers/BaseMapper.ts
export abstract class BaseMapper<TEntity, TDTO> {
  abstract toDTO(entity: TEntity): TDTO;
  abstract toDomain(dto: TDTO): TEntity;
  
  toDTOList(entities: TEntity[]): TDTO[] {
    return entities.map(e => this.toDTO(e));
  }
  
  toDomainList(dtos: TDTO[]): TEntity[] {
    return dtos.map(d => this.toDomain(d));
  }
}
```

**Usage:**
```typescript
export class ExpenseMapper extends BaseMapper<Expense, ExpenseDTO> {
  toDTO(entity: Expense): ExpenseDTO {
    return {
      id: entity.id,
      userId: entity.userId,
      amount: entity.amount,
      // ... mapping logic
    };
  }
  
  toDomain(dto: ExpenseDTO): Expense {
    return new Expense(dto.id, dto.userId, dto.amount /* ... */);
  }
}
```

### 2. **Generic CRUD Hook** (useEntityCRUD)

Eliminates ~500 lines of repetitive hook code.

```typescript
// apps/web/src/hooks/useEntityCRUD.ts
export function useEntityCRUD<TEntity, TCreateDTO, TUpdateDTO, TGetParams = string>({
  getUseCase,
  createUseCase,
  updateUseCase,
  deleteUseCase,
  getParams,
  autoLoad = true,
}: UseEntityCRUDOptions<...>): UseEntityCRUDReturn<...> {
  const [entities, setEntities] = useState<TEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Generic load, create, update, delete implementations
  // ...
  
  return { entities, isLoading, error, load, create, update, deleteEntity };
}
```

**Usage:**
```typescript
export function useProjects(userId: string) {
  const getProjectsUseCase = useMemo(() => container.getProjectsUseCase, []);
  const createProjectUseCase = useMemo(() => container.createProjectUseCase, []);
  
  return useEntityCRUD<ProjectDTO, CreateProjectDTO, UpdateProjectDTO>({
    getUseCase: getProjectsUseCase,
    createUseCase: createProjectUseCase,
    updateUseCase: container.updateProjectUseCase,
    deleteUseCase: container.deleteProjectUseCase,
    getParams: userId,
  });
}
```

### 3. **DI Container** (Singleton with Lazy Getters)

Centralized dependency management with lazy instantiation.

```typescript
// apps/web/src/infrastructure/di/Container.ts
class Container {
  private static instance: Container;
  private _expenseRepository?: ExpenseRepositoryAdapter;
  
  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
  
  get expenseRepository(): ExpenseRepositoryAdapter {
    if (!this._expenseRepository) {
      this._expenseRepository = new ExpenseRepositoryAdapter(this.storageService);
    }
    return this._expenseRepository;
  }
  
  get getExpensesUseCase(): GetExpensesUseCase {
    if (!this._getExpensesUseCase) {
      this._getExpensesUseCase = new GetExpensesUseCase(this.expenseRepository);
    }
    return this._getExpensesUseCase;
  }
}

export const container = Container.getInstance();
```

**Important:** Always memoize container getters in hooks to prevent infinite re-renders:
```typescript
// ✅ Correct
const getExpensesUseCase = useMemo(() => container.getExpensesUseCase, []);

// ❌ Wrong - causes infinite loop
getUseCase: container.getExpensesUseCase
```

### 4. **Strategy Pattern** (Hybrid Storage)

Flexible storage with interchangeable strategies.

```typescript
// apps/web/src/infrastructure/storage/HybridStorageAdapter.ts
export class HybridStorageAdapter implements IStorageService {
  constructor(
    private readonly primaryStorage: IStorageStrategy,   // Fast (LocalStorage)
    private readonly secondaryStorage: IStorageStrategy  // Persistent (GitHub API)
  ) {}
  
  async get<T>(key: string): Promise<T | null> {
    // Try primary first, fallback to secondary
    const data = await this.primaryStorage.get<T>(key);
    return data ?? await this.secondaryStorage.get<T>(key);
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    await this.primaryStorage.set(key, value);      // Instant
    this.syncQueue.set(key, value);                 // Background sync
  }
}
```

### 5. **Repository Pattern**

Abstracts data access with clean interfaces.

```typescript
// Business layer port
export interface IExpenseRepository {
  getAll(userId: string, startDate?: Date, endDate?: Date): Promise<Result<Expense[]>>;
  create(expense: Expense): Promise<Result<void>>;
}

// Infrastructure adapter
export class ExpenseRepositoryAdapter implements IExpenseRepository {
  constructor(private storage: IStorageService) {}
  
  async getAll(userId: string, startDate?: Date, endDate?: Date): Promise<Result<Expense[]>> {
    const dtos = await this.storage.get<ExpenseDTO[]>(`expenses_${userId}`);
    return Result.ok(dtos.map(dto => ExpenseMapper.toDomain(dto)));
  }
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

2. **Configure Environment Variables**
   - Add all variables from `.env.local`
   - Set in Vercel dashboard under Settings → Environment Variables

3. **Deploy**
   - Push to `main` or `dev` branch
   - Vercel automatically builds and deploys

### Manual Deployment

```bash
# Build all packages
pnpm build

# The production build is in apps/web/.next
# Deploy .next directory to your hosting provider
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 🎯 Best Practices

### React Performance
- ✅ Memoize expensive computations with `useMemo`
- ✅ Memoize callbacks with `useCallback`
- ✅ Always memoize container getters in hooks
- ✅ Use `React.memo` for pure components
- ✅ Avoid creating objects in dependency arrays

### TypeScript
- ✅ Enable `strict` mode
- ✅ Use explicit types for public APIs
- ✅ Prefer `interface` for object shapes
- ✅ Use generics for reusable logic

### Clean Architecture
- ✅ Domain layer has zero external dependencies
- ✅ Business layer depends only on domain
- ✅ Infrastructure implements business ports
- ✅ Adapters depend on everything but are not depended on

### Code Quality
- ✅ Follow SOLID principles
- ✅ Keep functions small and focused
- ✅ Use meaningful variable names
- ✅ Write self-documenting code
- ✅ Add comments only when necessary

---

## 🐛 Troubleshooting

### Common Issues

#### Infinite Loop Error
```
Maximum update depth exceeded
```
**Solution:** Ensure container getters are memoized in hooks:
```typescript
const getUseCase = useMemo(() => container.getMyUseCase, []);
```

#### TypeScript Compilation Errors
```
Cannot find module 'hayahub-business'
```
**Solution:** Build all packages first:
```bash
pnpm build
```

#### Storage Sync Issues
**Solution:** Check network connection and GitHub token validity

---

## 📚 Documentation

### Additional Resources
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**hayamij**

- GitHub: [@hayamij](https://github.com/hayamij)
- Repository: [HayaHub](https://github.com/hayamij/HayaHub)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React team for the revolutionary library
- The open-source community for inspiration and tools

---

## 📈 Changelog

### Version 1.0.0 (February 2026)

#### 🎉 Initial Release
- Complete Clean Architecture implementation
- 46 use cases across 10 feature domains
- 12 domain entities with full validation
- 11 mappers with BaseMapper pattern
- 31+ custom hooks with generic CRUD pattern
- Hybrid storage with Strategy Pattern
- Full offline-first support with background sync
- Dark/Light theme support
- Responsive design for all screen sizes
- Cloudinary integration for photo management
- GitHub API integration for persistent storage

#### 🐛 Bug Fixes
- Fixed infinite loop in useEntityCRUD by memoizing container getters
- Resolved date stability issues in expense filtering
- Fixed calendar event type mismatches
- Corrected Container DI pattern usage across all widgets

#### 🚀 Performance Improvements
- Eliminated ~900 lines of code through pattern reuse
- Optimized React re-renders with proper memoization
- Improved build times with Turborepo caching

---

<div align="center">

**Built with ❤️ by hayamij**

⭐ Star this repo if you find it useful!

</div>
