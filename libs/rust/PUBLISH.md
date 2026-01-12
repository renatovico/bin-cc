# Publishing Rust Crate to crates.io

This guide explains how to publish the Rust library to crates.io.

## Prerequisites

1. **crates.io Account**: Create an account at https://crates.io/
2. **API Token**: Generate an API token from https://crates.io/me

## Setup

1. **Login to crates.io**:
   ```bash
   cargo login YOUR_API_TOKEN
   ```

## Publishing Steps

1. **Update Version**: Update version in `Cargo.toml`

2. **Build and Test**:
   ```bash
   cd libs/rust
   cargo build --release
   cargo test
   ```

3. **Publish**:
   ```bash
   cargo publish
   ```

## GitHub Actions (Automated)

The project includes a GitHub Actions workflow for automated releases. To use it:

1. Add secret to GitHub repository:
   - `CARGO_REGISTRY_TOKEN`: Your crates.io API token

2. Create a GitHub release with tag `rust-v*` (e.g., `rust-v2.1.0`)

3. The workflow will automatically build, test, and publish to crates.io

## Version Guidelines

- Use semantic versioning: `MAJOR.MINOR.PATCH`
- Keep version in sync with main project version
- Tag releases as `rust-vX.Y.Z`
- Update CHANGELOG.md before releasing

## Documentation

Documentation is automatically generated and published to docs.rs when you publish a new version.
