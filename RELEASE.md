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
| **Java** | **Maven Central** | **`br.com.s2n.creditcard:creditcard-identifier`** | **2.1.0** |
| **Rust** | **crates.io** | **`creditcard-identifier`** | **2.1.0** |
| **Go** | **GitHub** | **`github.com/renatovico/bin-cc/libs/go`** | **2.1.0** |
| **PHP** | **Packagist** | **`creditcard/identifier`** | **2.1.0** |

## Publishing Process

### Automated Publishing (Recommended)

All 4 new libraries (Java, Rust, Go, PHP) have GitHub Actions workflows for automated publishing:

1. **Update version** in the package file:
   - Java: `libs/java/pom.xml`
   - Rust: `libs/rust/Cargo.toml`
   - Go: version is in Git tags only
   - PHP: `libs/php/composer.json`

2. **Commit and push** changes to the repository

3. **Create a GitHub Release**:
   - Go to https://github.com/renatovico/bin-cc/releases/new
   - Create tag with format: `<language>-v<version>` (e.g., `java-v2.1.0`, `rust-v2.1.0`, `go-v2.1.0`, `php-v2.1.0`)
   - Add release notes
   - Publish release

4. **GitHub Actions automatically**:
   - Runs tests
   - Builds packages
   - Publishes to the appropriate registry
   - For Go: Creates the module tag and triggers pkg.go.dev indexing

### Manual Publishing

For manual publishing, see the individual PUBLISH.md files in each library directory:

- [Java Publishing Guide](libs/java/PUBLISH.md)
- [Rust Publishing Guide](libs/rust/PUBLISH.md)
- [Go Publishing Guide](libs/go/PUBLISH.md)
- [PHP Publishing Guide](libs/php/PUBLISH.md)

## Required Secrets

To use automated publishing, add these secrets to the GitHub repository (Settings → Secrets and variables → Actions):

### Java (Maven Central)
- `OSSRH_USERNAME`: Sonatype JIRA username
- `OSSRH_PASSWORD`: Sonatype JIRA password

### Rust (crates.io)
- `CARGO_REGISTRY_TOKEN`: API token from https://crates.io/me

### Go
No secrets needed - uses Git tags only

### PHP (Packagist)
- `PACKAGIST_USERNAME`: Packagist username (optional, for triggering updates)
- `PACKAGIST_TOKEN`: API token from Packagist (optional, for triggering updates)

## Version Guidelines

1. **Semantic Versioning**: Use MAJOR.MINOR.PATCH format
   - MAJOR: Incompatible API changes
   - MINOR: Add functionality (backwards compatible)
   - PATCH: Bug fixes (backwards compatible)

2. **Synchronized Versions**: Keep all libraries at the same version number when possible

3. **Tag Format**: Use `<language>-vX.Y.Z` for releases (e.g., `java-v2.2.0`)

4. **Changelog**: Update CHANGELOG.md before releasing

## Pre-Release Checklist

Before creating a release:

- [ ] Update version in package file
- [ ] Run tests locally: `cd libs/<language> && <test-command>`
- [ ] Update CHANGELOG.md
- [ ] Update README.md if needed
- [ ] Commit all changes
- [ ] Create GitHub release with appropriate tag
- [ ] Verify automated workflow completes successfully
- [ ] Verify package appears in registry
- [ ] Test installation of published package

## Post-Release

After publishing:

1. **Verify Package Availability**:
   - Java: https://search.maven.org/artifact/br.com.s2n.creditcard/creditcard-identifier
   - Rust: https://crates.io/crates/creditcard-identifier
   - Go: https://pkg.go.dev/github.com/renatovico/bin-cc/libs/go
   - PHP: https://packagist.org/packages/creditcard/identifier

2. **Test Installation**:
   ```bash
   # Java
   mvn dependency:get -Dartifact=br.com.s2n.creditcard:creditcard-identifier:2.1.0
   
   # Rust
   cargo install creditcard-identifier
   
   # Go
   go get github.com/renatovico/bin-cc/libs/go@v2.1.0
   
   # PHP
   composer require creditcard/identifier:^2.1
   ```

3. **Update Documentation**: Ensure README and docs reflect new version

4. **Announce Release**: Post about new release in relevant channels

## Troubleshooting

### Java - Maven Central

**Issue**: Deployment fails with 401 Unauthorized
- **Solution**: Verify OSSRH credentials are correct in secrets

### Rust - crates.io

**Issue**: "crate already exists"
- **Solution**: Version already published, increment version number
- Note: crates.io doesn't allow unpublishing or overwriting versions

### Go - Module Publishing

**Issue**: Module not found at pkg.go.dev
- **Solution**: Wait a few minutes for indexing, or visit the URL directly to trigger indexing
- URL: `https://pkg.go.dev/github.com/renatovico/bin-cc/libs/go@v<version>`

### PHP - Packagist

**Issue**: Package not updating
- **Solution**: Manually trigger update at https://packagist.org/packages/creditcard/identifier
- Or set up GitHub webhook for automatic updates

## Support

For questions or issues with publishing:
1. Check individual PUBLISH.md files in library directories
2. Review GitHub Actions workflow logs
3. Open an issue at https://github.com/renatovico/bin-cc/issues
