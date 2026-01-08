# HayaHub Setup Guide

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or pnpm

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

3. **Configure GitHub API (Optional)**:

   The app works with localStorage by default. To enable GitHub sync:

   a. Copy the environment template:
   ```bash
   cd apps/web
   cp .env.example .env.local
   ```

   b. Create a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scope: `repo` (Full control of private repositories)
   - Copy the generated token

   c. Edit `apps/web/.env.local` and fill in your values:
   ```env
   NEXT_PUBLIC_GITHUB_TOKEN=ghp_your_token_here
   NEXT_PUBLIC_GITHUB_OWNER=your_github_username
   NEXT_PUBLIC_GITHUB_REPO=HayaHub
   NEXT_PUBLIC_GITHUB_BRANCH=data
   ```

4. Run development server:
```bash
npm run dev
```

Open http://localhost:3000

## Deployment to Vercel

### Prerequisites
- Vercel account
- GitHub repository

### Steps

1. **Import your repository to Vercel:**
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Click "Import"

2. **Configure Environment Variables:**

   In Vercel dashboard → Your Project → Settings → Environment Variables, add:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_GITHUB_TOKEN` | Your GitHub token | Production, Preview, Development |
   | `NEXT_PUBLIC_GITHUB_OWNER` | Your GitHub username | Production, Preview, Development |
   | `NEXT_PUBLIC_GITHUB_REPO` | Your repo name | Production, Preview, Development |
   | `NEXT_PUBLIC_GITHUB_BRANCH` | `data` | Production, Preview, Development |

   **Important**: 
   - ⚠️ Never commit your `.env.local` file
   - ⚠️ Never share your GitHub token publicly
   - ✅ Environment variables on Vercel are secure and not exposed

3. **Deploy:**
   - Vercel will auto-deploy when you push to main branch
   - Or click "Deploy" in Vercel dashboard

### GitHub Token Setup

To create a token with minimal permissions:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Set token name: `HayaHub Vercel`
4. Select expiration (recommend: 90 days or No expiration)
5. Select scopes:
   - ✅ `repo` - Full control of private repositories
     - Needed to read/write data files
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again)
8. Add to Vercel Environment Variables

### Without GitHub API

If you don't configure GitHub API:
- ✅ App works perfectly with localStorage
- ✅ Data persists in browser
- ❌ No cross-device sync
- ❌ No data backup to GitHub

## Architecture

### Storage Strategy

The app uses a hybrid storage approach:

1. **LocalStorage (Primary)**: 
   - Instant read/write
   - Always available
   - Browser-only persistence

2. **GitHub API (Optional)**:
   - Background sync
   - Cross-device data access
   - Data backup and version control

When GitHub is not configured, the app automatically falls back to localStorage-only mode.

## Security Notes

### For Open Source Contributors

- Never commit `.env.local` - it's in `.gitignore`
- Use `.env.example` as template
- Keep your GitHub token secret

### For Vercel Deployment

- Environment variables are encrypted at rest
- Only accessible during build and runtime
- Not exposed in client-side code (except NEXT_PUBLIC_* which are safe)
- Use fine-grained personal access tokens when possible

## Troubleshooting

### "GitHub token not configured" warning

This is normal if you haven't set up GitHub API. The app will work with localStorage only.

To fix: Follow the "Configure GitHub API" section above.

### CORS errors with GitHub API

Make sure your token has the `repo` scope and the repository settings allow API access.

### Data not syncing between devices

Verify:
1. GitHub API is configured correctly
2. Same repository is used across devices
3. Token has proper permissions
4. Check browser console for errors

## License

MIT License - See LICENSE file for details
