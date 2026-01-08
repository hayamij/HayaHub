# Vercel Environment Variables Setup

After deploying to Vercel, configure these environment variables:

## Step 1: Get Your GitHub Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Set token name: `HayaHub-Vercel`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token immediately** - you won't see it again!

## Step 2: Add to Vercel

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `NEXT_PUBLIC_GITHUB_TOKEN` | `ghp_xxxxxxxxxxxx` | Your GitHub token from Step 1 |
| `NEXT_PUBLIC_GITHUB_OWNER` | `hayamij` | Your GitHub username |
| `NEXT_PUBLIC_GITHUB_REPO` | `HayaHub` | Repository name |
| `NEXT_PUBLIC_GITHUB_BRANCH` | `data` | Branch for storing data |

**For each variable:**
- Paste the value
- Select environments: ✅ Production ✅ Preview ✅ Development
- Click **Save**

## Step 3: Redeploy

After saving all variables:
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **Redeploy**

## Troubleshooting

### "GitHub token not configured" warning

- Make sure variable names are exactly as shown above
- Check that variables are enabled for Production environment
- Redeploy after adding variables

### Data not syncing

1. Verify token has `repo` scope
2. Check that owner/repo names are correct
3. Ensure the repository exists and you have access

### Token expired

Generate a new token and update the `NEXT_PUBLIC_GITHUB_TOKEN` variable in Vercel, then redeploy.

## Security Notes

✅ **Safe**: Environment variables in Vercel are encrypted and secure
✅ **Safe**: `NEXT_PUBLIC_*` variables are used client-side for GitHub API
❌ **Never**: Commit your token to git
❌ **Never**: Share your token publicly
