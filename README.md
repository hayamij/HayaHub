# HayaHub - All-in-One Personal Management Hub

An integrated personal management system combining expense tracking, project management, calendars, todo lists, and wishlists.

## 🏗️ Architecture

Built with Clean Architecture principles:
- **Domain Layer**: Core business entities and rules
- **Business Layer**: Use cases and application logic
- **Adapters Layer**: UI components and API controllers
- **Infrastructure Layer**: External services (GitHub API, localStorage)

## 📦 Monorepo Structure

```
HayaHub/
├── packages/
│   ├── domain/          # Core business entities
│   ├── business/        # Use cases and application logic
│   └── shared/          # Shared utilities and types
└── apps/
    └── web/             # Next.js frontend application
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation

\`\`\`bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
\`\`\`

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **State Management**: React Context + Hooks
- **Storage**: GitHub API + Browser localStorage
- **Monorepo**: pnpm workspaces + Turborepo

## 📋 Features

- ✅ Expense Tracking
- 🚧 Project Management (Coming soon)
- 🚧 Calendar & Events (Coming soon)
- 🚧 Todo Lists (Coming soon)
- 🚧 Wishlists (Coming soon)

## 📄 License

ISC
