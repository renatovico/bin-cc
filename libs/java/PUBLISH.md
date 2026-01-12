# Publishing Java Library to Maven Central

This guide explains how to publish the Java library to Maven Central.

## Prerequisites

1. **Maven Central Account**: Create an account at https://central.sonatype.com/
2. **GPG Key**: Generate a GPG key pair for signing artifacts
3. **Maven Central Token**: Generate a token from your Maven Central account

## Setup GPG Key

1. **Generate GPG Key**:
   ```bash
   gpg --gen-key
   ```

2. **Export Private Key** (for GitHub Actions):
   ```bash
   gpg --armor --export-secret-keys YOUR_KEY_ID
   ```

3. **Publish Public Key**:
   ```bash
   gpg --keyserver keyserver.ubuntu.com --send-keys YOUR_KEY_ID
   ```

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

The project includes a GitHub Actions workflow for automated releases. To use it:

1. Add secrets to GitHub repository:
   - `MAVEN_CENTRAL_USERNAME`: Your Maven Central username
   - `MAVEN_CENTRAL_TOKEN`: Your Maven Central token
   - `GPG_PRIVATE_KEY`: Your GPG private key (armor-encoded)
   - `GPG_PASSPHRASE`: Your GPG key passphrase

2. Create a GitHub release with tag `java-v*` (e.g., `java-v2.1.0`)

3. The workflow will automatically build, sign, and deploy to Maven Central

## Version Guidelines

- Use semantic versioning: `MAJOR.MINOR.PATCH`
- Keep version in sync with main project version
- Tag releases as `java-vX.Y.Z`

## Migration from OSSRH

This library has been updated to use the new Maven Central publishing system instead of the legacy OSSRH Nexus repository. The new system:
- Uses the `central-publishing-maven-plugin` instead of `nexus-staging-maven-plugin`
- Automatically publishes without manual staging steps
- Requires a token-based authentication instead of username/password
