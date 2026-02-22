# 🏛️ HayaHub

> **All-in-one personal management hub built with Clean Architecture principles**

HayaHub is a comprehensive personal productivity platform that integrates expense tracking, project management, calendar, subscriptions, wishlists, quotes, and photo management into a single, elegant dashboard. Built with enterprise-grade architecture patterns, it ensures maintainability, testability, and scalability.

## ✨ Features

### 📊 Core Modules
- **Dashboard** - Centralized overview with customizable widgets for all modules
- **Spending Tracker** - Track expenses and income with categories, presets, and analytics (daily/weekly/monthly)
- **Subscriptions** - Manage recurring payments with renewal tracking and notifications
- **Calendar** - Event scheduling with time management and reminders
- **Projects & Tasks** - Project management with task tracking and priority management
- **Wishlists** - Track items you want with priorities, prices, and links
- **Quotes** - Save and manage inspirational quotes with authors
- **Photos** - Upload and organize photos with captions (Cloudinary integration)

### 🎨 UX Features
- **Authentication** - Secure user registration and login
- **Dark/Light Theme** - System-aware theme switching
- **Hybrid Storage** - LocalStorage (instant) + GitHub API (cloud sync)
- **Auto-Sync** - Background synchronization every 30 seconds
- **Offline Support** - Full functionality without internet connection
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Customizable Sidebar** - Drag-and-drop menu reordering

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn/UI (Radix UI primitives)
- **Icons**: Lucide React
- **Build Tool**: Turbo (monorepo orchestration)

### Storage & Sync
- **Primary Storage**: Browser LocalStorage (instant access)
- **Cloud Sync**: GitHub API (persistent backup)
- **Photo Storage**: Cloudinary (CDN-backed media hosting)
- **Sync Strategy**: Read-through cache with write-behind pattern

### Architecture
- **Pattern**: Clean Architecture (Domain-Driven Design)
- **Dependency Injection**: Custom DI Container
- **Repository Pattern**: Interface-based data abstraction
- **Strategy Pattern**: Swappable storage implementations

## 🏛️ Clean Architecture

HayaHub strictly follows Clean Architecture principles with a 4-layer structure where dependencies flow inward only:

```
┌─────────────────────────────────────────────────────────┐
│  Layer 4: INFRASTRUCTURE (apps/web/src/infrastructure) │
│  • Next.js framework integration                       │
│  • Storage adapters (LocalStorage, GitHub, Cloudinary) │
│  • DI Container & dependency wiring                    │
│  • Repository implementations                          │
└────────────────────┬────────────────────────────────────┘
                     │ implements interfaces from
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 3: ADAPTERS (apps/web/src)                      │
│  • React components & UI                               │
│  • Custom hooks (useExpenses, useProjects, etc.)       │
│  • Next.js API routes                                  │
│  • Presenters & view models                            │
└────────────────────┬────────────────────────────────────┘
                     │ depends on
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 2: BUSINESS LOGIC (packages/business)           │
│  • Use Cases (CreateExpense, UpdateProject, etc.)      │
│  • DTOs (Data Transfer Objects)                        │
│  • Ports (Repository interfaces)                       │
│  • Business rules & validation                         │
└────────────────────┬────────────────────────────────────┘
                     │ depends on
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 1: DOMAIN (packages/domain)                     │
│  • Pure entities (User, Expense, Project, etc.)        │
│  • Value objects (Money, Email, DateRange)             │
│  • Domain exceptions                                   │
│  • Enums & business constants                          │
│  • ZERO framework dependencies                         │
└─────────────────────────────────────────────────────────┘
```

### 📐 Project Structure

```
HayaHub/
├── apps/
│   └── web/                        # Next.js application
│       ├── src/
│       │   ├── app/                # Next.js pages (routes)
│       │   │   ├── dashboard/      # Dashboard page
│       │   │   ├── spending/       # Expense tracking
│       │   │   ├── subscriptions/  # Subscription management
│       │   │   ├── calendar/       # Calendar events
│       │   │   ├── projects/       # Projects & tasks
│       │   │   ├── wishlist/       # Wishlist items
│       │   │   ├── quote/          # Quote collection
│       │   │   ├── photos/         # Photo gallery
│       │   │   ├── login/          # Authentication
│       │   │   └── register/       # User registration
│       │   │
│       │   ├── components/         # React components
│       │   │   ├── layout/         # Header, Sidebar, Layout
│       │   │   ├── dashboard/      # Dashboard widgets
│       │   │   ├── ui/             # Shadcn/UI components
│       │   │   └── [feature]/      # Feature-specific components
│       │   │
│       │   ├── hooks/              # Custom React hooks
│       │   │   ├── useExpenses.ts
│       │   │   ├── useProjects.ts
│       │   │   ├── useOnlineSync.ts
│       │   │   └── ...
│       │   │
│       │   ├── infrastructure/     # Layer 4: Infrastructure
│       │   │   ├── di/
│       │   │   │   └── Container.ts    # DI Container
│       │   │   ├── storage/
│       │   │   │   ├── HybridStorageAdapter.ts
│       │   │   │   ├── LocalStorageAdapter.ts
│       │   │   │   └── strategies/
│       │   │   │       ├── LocalStorageStrategy.ts
│       │   │   │       └── GitHubStorageStrategy.ts
│       │   │   └── repositories/
│       │   │       ├── ExpenseRepositoryAdapter.ts
│       │   │       ├── ProjectRepositoryAdapter.ts
│       │   │       ├── CloudinaryPhotoRepositoryAdapter.ts
│       │   │       └── ...
│       │   │
│       │   ├── contexts/           # React contexts (Auth, Toast)
│       │   └── lib/                # Utility functions
│       │
│       └── package.json
│
├── packages/
│   ├── domain/                     # Layer 1: Domain (Pure Business Logic)
│   │   └── src/
│   │       ├── entities/           # Domain entities
│   │       │   ├── User.ts
│   │       │   ├── Expense.ts
│   │       │   ├── Project.ts
│   │       │   ├── Task.ts
│   │       │   ├── Subscription.ts
│   │       │   ├── CalendarEvent.ts
│   │       │   ├── WishItem.ts
│   │       │   ├── Quote.ts
│   │       │   └── Photo.ts
│   │       │
│   │       ├── value-objects/      # Immutable value objects
│   │       │   ├── Money.ts
│   │       │   ├── Email.ts
│   │       │   ├── DateRange.ts
│   │       │   └── UserSettings.ts
│   │       │
│   │       ├── enums/              # Business enums
│   │       │   ├── ExpenseCategory.ts
│   │       │   ├── ProjectStatus.ts
│   │       │   └── TaskPriority.ts
│   │       │
│   │       └── exceptions/         # Domain exceptions
│   │           ├── DomainException.ts
│   │           └── ValidationException.ts
│   │
│   ├── business/                   # Layer 2: Business Logic (Use Cases)
│   │   └── src/
│   │       ├── use-cases/
│   │       │   ├── expense/        # Expense use cases
│   │       │   ├── project/        # Project use cases
│   │       │   ├── task/           # Task use cases
│   │       │   ├── subscription/   # Subscription use cases
│   │       │   ├── calendar/       # Calendar use cases
│   │       │   ├── wishlist/       # Wishlist use cases
│   │       │   ├── quote/          # Quote use cases
│   │       │   ├── photo/          # Photo use cases
│   │       │   └── user/           # User & auth use cases
│   │       │
│   │       ├── dtos/               # Data Transfer Objects
│   │       └── ports/              # Repository interfaces
│   │           ├── IExpenseRepository.ts
│   │           ├── IProjectRepository.ts
│   │           ├── IPhotoRepository.ts
│   │           └── ...
│   │
│   └── shared/                     # Shared utilities
│       └── src/
│           ├── types/
│           └── utils/
│
├── package.json                    # Root package.json (workspaces)
├── turbo.json                      # Turbo configuration
├── tsconfig.base.json              # Base TypeScript config
└── pnpm-workspace.yaml             # pnpm workspaces config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (or npm >= 9.0.0)
- **Git**: For repository management
- **GitHub Account**: (Optional) For cloud sync feature
- **Cloudinary Account**: (Optional) For photo uploads

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

3. **Configure environment variables**
   ```bash
   cd apps/web
   cp .env.example .env.local
   ```

   Edit `.env.local` and fill in your credentials:
   
   **GitHub Sync** (Optional - app works with LocalStorage only):
   ```env
   NEXT_PUBLIC_GITHUB_TOKEN=ghp_your_token_here
   NEXT_PUBLIC_GITHUB_OWNER=your_username
   NEXT_PUBLIC_GITHUB_REPO=your_repo_name
   NEXT_PUBLIC_GITHUB_BRANCH=data
   ```
   
   **Cloudinary Photo Storage** (Optional):
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Run development server**
   ```bash
   cd ../..  # Back to root
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Setting Up GitHub Sync (Optional)

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with `repo` scope
3. Create a new repository for data storage (e.g., `hayahub-data`)
4. Add credentials to `.env.local`

### Setting Up Cloudinary (Optional)

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Go to Settings → Upload → Upload presets
3. Create an **UNSIGNED** upload preset (e.g., `hayahub_photos`)
4. Add your cloud name and preset to `.env.local`

## 📝 Development Guide

### Available Scripts

```bash
# Development (all packages)
pnpm dev              # Start Next.js dev server + watch mode

# Build
pnpm build            # Build all packages for production
turbo build           # Build with Turbo cache

# Code Quality
pnpm lint             # Run ESLint on all packages
pnpm type-check       # TypeScript type checking
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run unit tests (Vitest)

# Clean
pnpm clean            # Remove all build artifacts and node_modules
```

### Development Workflow

HayaHub follows **Clean Architecture** principles strictly. Always develop from **inside-out**:

#### 1. Domain First (packages/domain)
Define your core business entities and rules:

```typescript
// packages/domain/src/entities/YourEntity.ts
export class YourEntity {
  constructor(
    public readonly id: string,
    public name: string,
    private createdAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new ValidationException('Name cannot be empty');
    }
  }

  // Business logic methods
  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new ValidationException('Name cannot be empty');
    }
    this.name = newName;
  }
}
```

**Rules:**
- ✅ Pure TypeScript/JavaScript (NO framework imports)
- ✅ Self-validating entities
- ✅ Rich domain models with business logic
- ✅ Throw domain exceptions for violations
- ❌ NO dependencies on outer layers

#### 2. Business Layer (packages/business)

Define use cases that orchestrate business logic:

```typescript
// packages/business/src/ports/IYourRepository.ts
export interface IYourRepository {
  save(entity: YourEntity): Promise<YourEntity>;
  findById(id: string): Promise<YourEntity | null>;
  findAll(): Promise<YourEntity[]>;
  delete(id: string): Promise<void>;
}

// packages/business/src/use-cases/your-feature/CreateYourEntityUseCase.ts
export class CreateYourEntityUseCase {
  constructor(private readonly repository: IYourRepository) {}

  async execute(input: CreateYourEntityDTO): Promise<YourEntity> {
    // Business logic orchestration
    const entity = new YourEntity(
      generateId(),
      input.name,
      new Date()
    );

    return await this.repository.save(entity);
  }
}
```

**Rules:**
- ✅ Define repository interfaces (Ports)
- ✅ Create DTOs for input/output
- ✅ Implement use cases with single responsibility
- ✅ Depend ONLY on domain layer
- ❌ NO framework dependencies
- ❌ NO direct database/API calls

#### 3. Infrastructure Layer (apps/web/src/infrastructure)

Implement concrete adapters:

```typescript
// apps/web/src/infrastructure/repositories/YourRepositoryAdapter.ts
export class YourRepositoryAdapter implements IYourRepository {
  constructor(private readonly storage: IStorageService) {}

  async save(entity: YourEntity): Promise<YourEntity> {
    await this.storage.setItem(`your-entity-${entity.id}`, entity);
    return entity;
  }

  async findById(id: string): Promise<YourEntity | null> {
    const data = await this.storage.getItem<YourEntity>(`your-entity-${id}`);
    return data;
  }

  // ... other methods
}

// apps/web/src/infrastructure/di/Container.ts - Wire up dependencies
public static getCreateYourEntityUseCase(): CreateYourEntityUseCase {
  const repository = new YourRepositoryAdapter(this.getStorageService());
  return new CreateYourEntityUseCase(repository);
}
```

**Rules:**
- ✅ Implement interfaces from business layer
- ✅ Framework-specific code lives here
- ✅ Register in DI Container
- ❌ NO business logic here

#### 4. UI Layer (apps/web/src)

Create React components and hooks:

```typescript
// apps/web/src/hooks/useYourFeature.ts
export function useYourFeature() {
  const [items, setItems] = useState<YourEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const createItem = async (input: CreateYourEntityDTO) => {
    setLoading(true);
    try {
      const useCase = Container.getCreateYourEntityUseCase();
      const result = await useCase.execute(input);
      setItems([...items, result]);
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, createItem };
}

// apps/web/src/components/your-feature/YourComponent.tsx
export function YourComponent() {
  const { items, loading, createItem } = useYourFeature();

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}
```

**Rules:**
- ✅ Use custom hooks to interact with use cases
- ✅ Components ONLY handle UI concerns
- ✅ Access business logic via Container
- ❌ NO direct repository access from components

## 💾 Storage Architecture

### Hybrid Storage Pattern

HayaHub uses a sophisticated **Hybrid Storage Strategy** combining:
- **LocalStorage** (Primary): Instant access, offline-first
- **GitHub API** (Secondary): Cloud backup, multi-device sync

```
┌──────────────────────────────────────────────────────┐
│                   USER ACTION                         │
│          (Create, Update, Delete data)                │
└───────────────────┬──────────────────────────────────┘
                    │
                    ↓
┌──────────────────────────────────────────────────────┐
│              PRIMARY STORAGE                          │
│            (LocalStorage - Instant)                   │
│  • Write immediately (no latency)                     │
│  • Read first for best performance                    │
│  • Offline-first architecture                         │
└───────────────────┬──────────────────────────────────┘
                    │
                    ↓
┌──────────────────────────────────────────────────────┐
│              SYNC QUEUE (30s interval)                │
│  • Batches pending changes                            │
│  • Prevents excessive API calls                       │
│  • Shows sync status in UI                            │
└───────────────────┬──────────────────────────────────┘
                    │
                    ↓
┌──────────────────────────────────────────────────────┐
│            SECONDARY STORAGE                          │
│          (GitHub API - Background)                    │
│  • Persistent cloud backup                            │
│  • Multi-device synchronization                       │
│  • Conflict resolution (last-write-wins)              │
└──────────────────────────────────────────────────────┘
```

### Storage Strategies

#### LocalStorageStrategy
- Stores data in browser's localStorage
- Synchronous operations (instant)
- Limited to ~5-10MB depending on browser
- Persists across sessions
- No network required

#### GitHubStorageStrategy
- Stores data in GitHub repository (JSON files)
- Uses GitHub REST API v3
- Requires personal access token with `repo` scope
- Automatic commit creation for each sync
- Version history via Git commits

#### HybridStorageAdapter
Combines both strategies with intelligent fallback:

**Read Pattern:**
```
1. Check LocalStorage first (cache hit → return immediately)
2. If not found, fetch from GitHub (cache miss → update local cache)
3. Return data
```

**Write Pattern:**
```
1. Write to LocalStorage immediately (instant feedback)
2. Add to sync queue
3. Background worker syncs to GitHub every 30s
4. UI shows sync status (syncing/success/error)
```

**Conflict Resolution:**
- Last-write-wins strategy
- Auto-refresh data after login
- Manual refresh available in UI

### Photo Storage

Photos use **Cloudinary** for CDN-backed hosting:
- Direct browser upload (no backend needed)
- Automatic image optimization
- Fast CDN delivery worldwide
- Metadata stored in LocalStorage/GitHub
- Cloudinary URLs tracked for retrieval

### Code Quality Standards

#### Architectural Rules (MUST follow)

1. **Dependency Rule**: Dependencies flow inward only
   ```
   ❌ Domain importing from Business
   ❌ Business importing from Adapters
   ❌ Domain/Business importing from Infrastructure
   ✅ Infrastructure → Adapters → Business → Domain
   ```

2. **Framework Independence**
   ```typescript
   ❌ Domain with React imports
   ❌ Business layer with Next.js imports
   ✅ Domain: Pure TypeScript (zero dependencies)
   ✅ Business: Only depends on domain
   ```

3. **Interface Segregation**
   ```typescript
   ✅ Business layer defines repository interfaces
   ✅ Infrastructure implements those interfaces
   ❌ Business layer importing concrete implementations
   ```

4. **Single Responsibility**
   ```typescript
   ✅ One use case per file
   ✅ One responsibility per class
   ❌ God classes with multiple responsibilities
   ```

#### TypeScript Standards

- **Strict mode** enabled (`strict: true`)
- **Explicit types** for function parameters and returns
- **No `any`** type (use `unknown` if necessary)
- **Interfaces** for contracts, **types** for unions/intersections
- **Readonly** properties where appropriate

#### React Standards

- **Functional components** only
- **Custom hooks** for business logic
- **Props interfaces** for all components
- **Use client** directive for interactive components
- **Descriptive names** for hooks (`useExpenses`, not `useData`)

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in specific package
cd packages/domain
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### Testing Strategy

- **Domain Layer**: Unit tests for entities and value objects
- **Business Layer**: Unit tests for use cases with mocked repositories
- **Infrastructure Layer**: Integration tests for adapters
- **UI Layer**: Component tests with React Testing Library

### Example Test

```typescript
// packages/domain/src/entities/__tests__/Expense.test.ts
import { describe, it, expect } from 'vitest';
import { Expense } from '../Expense';
import { Money } from '../../value-objects/Money';

describe('Expense', () => {
  it('should create a valid expense', () => {
    const expense = new Expense(
      '1',
      'userId',
      'Lunch',
      new Money(15.50, 'USD'),
      ExpenseCategory.FOOD,
      new Date()
    );

    expect(expense.id).toBe('1');
    expect(expense.description).toBe('Lunch');
    expect(expense.amount.value).toBe(15.50);
  });

  it('should throw error for negative amount', () => {
    expect(() => {
      new Money(-10, 'USD');
    }).toThrow(ValidationException);
  });
});
```

## 🐛 Common Issues & Solutions

### Issue: Sync not working
**Solution:** Check your GitHub token has `repo` scope and repository exists

### Issue: Photos not uploading
**Solution:** Verify Cloudinary credentials and upload preset is UNSIGNED

### Issue: LocalStorage quota exceeded
**Solution:** Clear old data or reduce stored items (browser limit ~5-10MB)

### Issue: Type errors in business/domain
**Solution:** Ensure you're not importing from outer layers (check imports)

## 📦 Deployment

### Build for Production

```bash
# Build all packages
pnpm build

# Output: apps/web/.next/
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_GITHUB_TOKEN`
   - `NEXT_PUBLIC_GITHUB_OWNER`
   - `NEXT_PUBLIC_GITHUB_REPO`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
4. Deploy

### Environment Variables

All environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Follow Clean Architecture principles
4. Write tests for new features
5. Ensure `pnpm lint` and `pnpm type-check` pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Respect the dependency rule (no inward dependencies)
- Keep entities and value objects pure (no framework code)
- Write use cases with single responsibility
- Add tests for business logic
- Update documentation for new features

## 📚 Resources

### Clean Architecture
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)

### Technologies
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Turbo](https://turbo.build/)

## 📄 License

MIT License - Copyright (c) 2026 Nguyen Quang Tuan Phuong

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

<div align="center">

**Built with ❤️ by [hayamij](https://github.com/hayamij)**

⭐ Star this repo if you find it helpful!

</div>