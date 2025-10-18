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

### 2. Build and Release

**File:** `build-and-release.yml`

**Triggers:**
- Push to `main` or `master` branches

**What it does:**
- Builds and validates data files
- Runs all tests
- Uploads compiled data as artifacts
- Automatically creates releases when data sources change
- Auto-increments patch version
- Tags releases with version number

**Release Process:**
1. When changes are pushed to `data/sources/`, the workflow detects them
2. Automatically increments the patch version (e.g., 2.0.0 → 2.0.1)
3. Creates a GitHub release with tag `v2.0.1`
4. Attaches compiled data files to the release

### 3. Manual Release

**File:** `manual-release.yml`

**Triggers:**
- Manual dispatch from GitHub Actions UI

**What it does:**
- Allows you to manually create a release with a specific version
- Updates package.json version
- Creates a tagged release
- Includes all data files in the release

**How to use:**
1. Go to Actions tab in GitHub
2. Select "Manual Release" workflow
3. Click "Run workflow"
4. Enter version number (e.g., `2.1.0`)
5. Optionally add release notes
6. Click "Run workflow"

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
