# Release and Publishing Guide

This document describes how to publish new versions of the bin-cc libraries to their respective package registries.

## Overview

The bin-cc project provides libraries in 9 programming languages. Each language has its own package registry and publishing process:

| Language | Registry | Package Name | Current Version |
|----------|----------|--------------|-----------------|
| JavaScript | npm | `creditcard-identifier` | 2.1.0 |
| Python | PyPI | `creditcard-identifier` | 2.1.0 |
| Ruby | RubyGems | `creditcard-identifier` | 2.1.0 |
| Elixir | Hex.pm | `creditcard_identifier` | 2.1.0 |
| .NET/C# | NuGet | `CreditCardIdentifier` | 2.1.0 |
| Java | Maven Central | `br.com.s2n.creditcard:creditcard-identifier` | 2.1.0 |
| Rust | crates.io | `creditcard-identifier` | 2.1.0 |
| Go | GitHub | `github.com/renatovico/bin-cc/libs/go/v2` | 2.1.0 |
| PHP | Packagist | `creditcard/identifier` | 2.1.0 |

## Publishing Process

### Unified Release Workflow (Recommended)

All libraries use a unified GitHub Actions workflow for automated publishing. To publish a new version:

1. **Update version** in the workflow (VERSION environment variable will be set from release tag or manual input)

2. **Commit and push** any necessary changes to the repository

3. **Create a GitHub Release**:
   - Go to https://github.com/renatovico/bin-cc/releases/new
   - Create tag in format: `vX.Y.Z` (e.g., `v2.2.0`) for unified release of all packages
   - Add release notes
   - Publish release

4. **GitHub Actions automatically**:
   - Builds data files
   - Runs tests for each language
   - Publishes to all package registries:
     - npm
     - PyPI
     - RubyGems
     - Hex.pm
     - NuGet
     - Maven Central
     - crates.io
     - Go module (creates Git tag)
     - Packagist

### Manual Workflow Dispatch

You can also manually trigger a release for a specific version:

1. Go to Actions → Release Packages → Run workflow
2. Enter version number (e.g., `2.2.0`)
3. Click "Run workflow"

### Manual Publishing

For manual publishing, see the individual PUBLISH.md files in each library directory:

- [Java Publishing Guide](libs/java/PUBLISH.md)
- [Rust Publishing Guide](libs/rust/PUBLISH.md)
- [Go Publishing Guide](libs/go/PUBLISH.md)
- [PHP Publishing Guide](libs/php/PUBLISH.md)

## Required Secrets

To use automated publishing, add these secrets to the GitHub repository (Settings → Secrets and variables → Actions):

### JavaScript (npm)
- Uses trusted publishing with OIDC (no secrets needed)

### Python (PyPI)
- Uses trusted publishing with OIDC (no secrets needed)

### Ruby (RubyGems)
- `RUBYGEMS_API_KEY`: API token from https://rubygems.org/settings/edit

### Elixir (Hex.pm)
- `HEX_API_KEY`: API token from Hex.pm

### .NET (NuGet)
- `NUGET_API_KEY`: API token from https://www.nuget.org/account/apikeys

### Java (Maven Central)
- `MAVEN_CENTRAL_USERNAME`: Maven Central username
- `MAVEN_CENTRAL_TOKEN`: Maven Central token (from https://central.sonatype.com/)

### Rust (crates.io)
- `CARGO_REGISTRY_TOKEN`: API token from https://crates.io/me

### Go
- No secrets needed - uses Git tags only

### PHP (Packagist)
- `PACKAGIST_USERNAME`: Packagist username (optional, for triggering updates)
- `PACKAGIST_TOKEN`: API token from Packagist (optional, for triggering updates)

## Version Guidelines

1. **Semantic Versioning**: Use MAJOR.MINOR.PATCH format
   - MAJOR: Incompatible API changes
   - MINOR: Add functionality (backwards compatible)
   - PATCH: Bug fixes (backwards compatible)

2. **Synchronized Versions**: All libraries are released at the same version number

3. **Tag Format**: Use `vX.Y.Z` for unified releases (e.g., `v2.2.0`)

4. **Go Module Path**: For Go v2+, the module path is `github.com/renatovico/bin-cc/libs/go/v2`

## Pre-Release Checklist

Before creating a release:

- [ ] Update CHANGELOG.md with changes
- [ ] Update README.md if needed
- [ ] Run tests locally for modified languages
- [ ] Commit all changes
- [ ] Create GitHub release with tag `vX.Y.Z`
- [ ] Verify automated workflow completes successfully
- [ ] Verify packages appear in all registries
- [ ] Test installation of published packages

## Post-Release

After publishing:

1. **Verify Package Availability**:
   - JavaScript: https://www.npmjs.com/package/creditcard-identifier
   - Python: https://pypi.org/project/creditcard-identifier/
   - Ruby: https://rubygems.org/gems/creditcard-identifier
   - Elixir: https://hex.pm/packages/creditcard_identifier
   - .NET: https://www.nuget.org/packages/CreditCardIdentifier/
   - Java: https://central.sonatype.com/artifact/br.com.s2n.creditcard/creditcard-identifier
   - Rust: https://crates.io/crates/creditcard-identifier
   - Go: https://pkg.go.dev/github.com/renatovico/bin-cc/libs/go/v2
   - PHP: https://packagist.org/packages/creditcard/identifier

2. **Test Installation**:
   ```bash
   # JavaScript
   npm install creditcard-identifier
   
   # Python
   pip install creditcard-identifier
   
   # Ruby
   gem install creditcard-identifier
   
   # Elixir
   mix hex.info creditcard_identifier
   
   # .NET
   dotnet add package CreditCardIdentifier
   
   # Java
   mvn dependency:get -Dartifact=br.com.s2n.creditcard:creditcard-identifier:2.2.0
   
   # Rust
   cargo add creditcard-identifier
   
   # Go
   go get github.com/renatovico/bin-cc/libs/go/v2@v2.2.0
   
   # PHP
   composer require creditcard/identifier:^2.2
   ```

3. **Update Documentation**: Ensure README and docs reflect new version

4. **Announce Release**: Post about new release in relevant channels

## Troubleshooting

### Java - Maven Central

**Issue**: Deployment fails
- **Solution**: Verify MAVEN_CENTRAL_USERNAME and MAVEN_CENTRAL_TOKEN are correct in secrets
- **Note**: The new Maven Central publishing system (central-publishing-maven-plugin) does not require GPG signing

### Rust - crates.io

**Issue**: "crate already exists"
- **Solution**: Version already published, increment version number
- Note: crates.io doesn't allow unpublishing or overwriting versions

### Go - Module Publishing

**Issue**: Module not found at pkg.go.dev
- **Solution**: Wait a few minutes for indexing, or visit the URL directly to trigger indexing
- URL: `https://pkg.go.dev/github.com/renatovico/bin-cc/libs/go/v2@v<version>`
- **Note**: For v2+, the module path includes `/v2` suffix

### PHP - Packagist

**Issue**: Package not updating
- **Solution**: Manually trigger update at https://packagist.org/packages/creditcard/identifier
- Or set up GitHub webhook for automatic updates

### Workflow Failures

**Issue**: Release workflow fails for one language
- **Solution**: Check GitHub Actions logs for specific errors
- Each language publishes independently, so failures in one don't affect others

## Support

For questions or issues with publishing:
1. Check individual PUBLISH.md files in library directories
2. Review GitHub Actions workflow logs at https://github.com/renatovico/bin-cc/actions
3. Open an issue at https://github.com/renatovico/bin-cc/issues
