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

### Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Full Setup Guide

See [SETUP.md](./SETUP.md) for detailed instructions on:
- Local development setup
- GitHub API configuration (optional)
- Vercel deployment
- Environment variables
- Troubleshooting

### Prerequisites
- Node.js 18+
- pnpm 8+
- GitHub Personal Access Token (optional, for data sync)

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **State Management**: React Context + Hooks
- **Storage**: Hybrid (Browser localStorage + GitHub API sync)
- **Monorepo**: pnpm workspaces + Turborepo

## 🔒 Security & Privacy

- All data stored locally in your browser by default
- Optional GitHub sync with your own private repository
- Your GitHub token is never committed to the repository
- Open source - audit the code yourself

## 🌐 Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hayamij/HayaHub)

**Important**: Configure environment variables in Vercel dashboard after deployment. See [SETUP.md](./SETUP.md) for details.

## 📋 Features

- ✅ Expense Tracking
- 🚧 Project Management (Coming soon)
- 🚧 Calendar & Events (Coming soon)
- 🚧 Todo Lists (Coming soon)
- 🚧 Wishlists (Coming soon)

## 📄 License

ISC
