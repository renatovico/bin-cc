# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating builds and tests.

## Workflows

### 1. CI (Continuous Integration)

**File:** `ci.yml`

**Triggers:**
- Push to `main` or `master` branches
- Pull requests to `main` or `master` branches

**What it does:**
- Tests on multiple Node.js versions (16.x, 18.x, 20.x)
- Builds data files
- Validates JSON files
- Runs JavaScript tests
- Tests Python and Ruby examples

### 2. Publish NPM Package

**File:** `publish-npm.yml`

**Triggers:**
- Manual dispatch from GitHub Actions UI

**What it does:**
- Updates the JavaScript library version
- Runs tests
- Publishes to NPM registry
- Creates a Git tag (e.g., `v1.2.0`)
- Creates a GitHub release for the library

**How to use:**
1. Go to Actions tab in GitHub
2. Select "Publish NPM Package" workflow
3. Click "Run workflow"
4. Enter version number (e.g., `1.2.0`)
5. Select NPM tag (`latest`, `beta`, `next`)
6. Click "Run workflow"

## Setting Up

### For NPM Publishing

Add `NPM_TOKEN` secret to repository:
1. Generate token at https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Go to repository Settings → Secrets → Actions
3. Add secret named `NPM_TOKEN`

## Development Workflow

```bash
# 1. Edit source files
vim data/sources/visa/base.json

# 2. Build and validate
npm run build

# 3. Run tests
cd libs/javascript && npm test && cd ../..

# 4. Commit
git add data/
git commit -m "Update Visa BIN patterns"
git push
```

## Environment Requirements

- Node.js 16.x, 18.x, or 20.x
- Python 3.x (for examples)
- Ruby 2.5+ (for examples)

## Troubleshooting

### Failed Builds

If a build fails:
1. Check the workflow logs in the Actions tab
2. Run `npm run build` locally to reproduce
3. Fix issues in source files
4. Push changes

### Failed Tests

If tests fail:
1. Check test logs in the workflow output
2. Run tests locally: `cd libs/javascript && npm test`
3. Fix test failures
4. Push changes

## Security

- Workflows use `GITHUB_TOKEN` which is automatically provided
- NPM publishing requires `NPM_TOKEN` secret

## Best Practices

1. **Test locally first:** Always run `npm run build` and `npm test` before pushing
2. **Check CI status:** Wait for CI to pass before merging PRs
