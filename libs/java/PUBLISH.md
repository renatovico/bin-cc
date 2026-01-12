# Publishing Java Library to Maven Central

This guide explains how to publish the Java library to Maven Central.

## Prerequisites

1. **Maven Central Account**: Create an account at https://central.sonatype.com/
2. **Maven Central Token**: Generate a token from your Maven Central account settings

## Publishing Steps

1. **Update Version**: Update version in `pom.xml`

2. **Build and Test**:
   ```bash
   cd libs/java
   mvn clean test
   ```

3. **Deploy to Maven Central**:
   ```bash
   mvn clean deploy -P release
   ```

## GitHub Actions (Automated)

The project includes a unified GitHub Actions workflow for automated releases. To use it:

1. Add secrets to GitHub repository:
   - `MAVEN_CENTRAL_USERNAME`: Your Maven Central username
   - `MAVEN_CENTRAL_TOKEN`: Your Maven Central token

2. Create a GitHub release with tag `vX.Y.Z` (e.g., `v2.2.0`)

3. The workflow will automatically build and deploy to Maven Central

## Version Guidelines

- Use semantic versioning: `MAJOR.MINOR.PATCH`
- Keep version in sync with main project version
- All packages are released together with the same version number

## Migration from OSSRH

This library has been updated to use the new Maven Central publishing system instead of the legacy OSSRH Nexus repository. The new system:
- Uses the `central-publishing-maven-plugin` instead of `nexus-staging-maven-plugin`
- Automatically publishes without manual staging steps
- Requires token-based authentication instead of username/password
- Does not require GPG signing (signing is handled by Maven Central)
