# NPM Publish Workflow

This repository includes an automated GitHub Actions workflow that builds and publishes the package to NPM.

## How it works

The workflow (`npm-publish.yml`) automatically:
1. Increments the package version (patch by default)
2. Updates both root and library `package.json` files
3. Runs `npm run build` to create the distribution
4. Publishes the built package to NPM
5. Commits the version changes and creates a git tag

## Setup Required

### NPM Token

You need to set up an NPM token secret in your repository:

1. Go to [NPM](https://www.npmjs.com) and log in
2. Go to your account settings → Access Tokens
3. Create a new "Automation" token
4. In your GitHub repository, go to Settings → Secrets and variables → Actions
5. Add a new repository secret named `NPM_TOKEN` with your NPM token as the value

### Triggering the Workflow

The workflow runs automatically when:
- Code is pushed to the `master` branch (analyzes PR title to determine version type)

**Automatic Version Detection from PR Titles:**
The workflow automatically detects the version increment type from your PR title:

- **Major**: Include `[major]`, `major:`, or `BREAKING` in the PR title
- **Minor**: Include `[minor]`, `minor:`, or `feat:` in the PR title  
- **Patch**: Default for all other PR titles

Examples:
- `"Fix button styling issue"` → patch version (1.0.0 → 1.0.1)
- `"feat: Add new notification types"` → minor version (1.0.0 → 1.1.0)
- `"[major] Restructure API endpoints"` → major version (1.0.0 → 2.0.0)
- `"BREAKING: Remove deprecated methods"` → major version (1.0.0 → 2.0.0)

You can also trigger it manually:
- Go to Actions tab in your repository
- Select "Build and Publish to NPM" workflow  
- Click "Run workflow"
- Choose the version increment type (patch, minor, or major)

## Version Strategy

- **Patch**: Bug fixes and small changes (1.0.0 → 1.0.1)
- **Minor**: New features that are backward compatible (1.0.0 → 1.1.0)  
- **Major**: Breaking changes (1.0.0 → 2.0.0)

The workflow follows semantic versioning and automatically updates:
- Root `package.json`
- Library `src/lib/package.json`
- NPM package lock file
- Creates git tags for releases