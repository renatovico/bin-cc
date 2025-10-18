# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating builds, tests, and releases.

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

### 2. Data Release

**File:** `data-release.yml`

**Triggers:**
- Push to `main` or `master` branches
- Only when changes are made to `data/sources/**` or `scripts/build.js`

**What it does:**
- Builds and validates data files
- Automatically increments patch version in root package.json
- Creates GitHub release with tag `data-vX.Y.Z`
- Attaches all data files (brands.json, compiled/brands.json, sources/*.json)

**Release Assets:**
- `data/brands.json` - Legacy format
- `data/compiled/brands.json` - Enhanced format
- `data/sources/*.json` - Source files

### 3. Publish NPM Package

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

## Architecture

This project separates data releases from library releases:

### Data Releases (GitHub Releases)
- Tagged as `data-vX.Y.Z`
- Contains BIN pattern data
- Updated when `data/sources/**` changes
- Downloaded automatically by the JavaScript library

### Library Releases (NPM)
- Tagged as `vX.Y.Z`
- Published to NPM
- Contains validation logic
- Downloads data from GitHub releases on install

## Setting Up

### For Data Releases
No setup required - automatic when data sources are updated.

### For NPM Publishing
Add `NPM_TOKEN` secret to repository:
1. Generate token at https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Go to repository Settings → Secrets → Actions
3. Add secret named `NPM_TOKEN`

## Release Process

### Updating Data
```bash
# 1. Edit source files
vim data/sources/visa.json

# 2. Build and commit
npm run build
git add data/
git commit -m "Update Visa BIN patterns"
git push

# 3. GitHub Actions automatically:
#    - Builds data
#    - Creates release (data-v2.0.2)
#    - Attaches data files
```

### Publishing Library
```bash
# 1. Go to Actions → Publish NPM Package
# 2. Click "Run workflow"
# 3. Enter version: 1.3.0
# 4. Select tag: latest
# 5. Click "Run workflow"

# GitHub Actions automatically:
#    - Updates package.json
#    - Runs tests
#    - Publishes to NPM
#    - Creates release (v1.3.0)
```

## Setting Up

These workflows run automatically once the repository is on GitHub. No additional setup is required.

## Artifacts

Build artifacts (compiled data files) are stored for 30 days and can be downloaded from:
- Actions tab → Select a workflow run → Artifacts section

## Release Assets

Each release includes:
- `data/brands.json` - Legacy format
- `data/compiled/brands.json` - Enhanced format
- Source files from `data/sources/` (manual releases only)

## Environment Requirements

- Node.js 16.x, 18.x, or 20.x
- Python 3.x (for examples)
- Ruby 2.5+ (for examples)

## Customization

To modify the workflows:

1. **Change Node.js versions:**
   Edit the `matrix.node-version` in `ci.yml`

2. **Change version bumping strategy:**
   Edit the version calculation in `build-and-release.yml`

3. **Add more tests:**
   Add steps to any workflow file

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

### Release Not Created

If an automatic release wasn't created:
1. Check if there were actually changes in `data/sources/`
2. Verify the workflow completed successfully
3. Check workflow logs for errors
4. Use manual release as fallback

## Security

- Workflows use `GITHUB_TOKEN` which is automatically provided
- No additional secrets required
- Token has write permissions for releases and tags

## Best Practices

1. **Test locally first:** Always run `npm run build` and `npm test` before pushing
2. **Use descriptive commits:** Help the auto-release generate good release notes
3. **Manual releases for major versions:** Use manual workflow for version 3.0.0, etc.
4. **Review release notes:** Edit release notes after auto-creation if needed
