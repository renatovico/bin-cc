# Publishing Java Library to Maven Central

This guide explains how to publish the Java library to Maven Central.

## Prerequisites

1. **Sonatype JIRA Account**: Create an account at https://issues.sonatype.org/
2. **GPG Key**: Generate a GPG key pair for signing artifacts
3. **Maven Settings**: Configure `~/.m2/settings.xml` with credentials

## Setup Maven Settings

Add to `~/.m2/settings.xml`:

```xml
<settings>
  <servers>
    <server>
      <id>ossrh</id>
      <username>YOUR_SONATYPE_USERNAME</username>
      <password>YOUR_SONATYPE_PASSWORD</password>
    </server>
  </servers>
  <profiles>
    <profile>
      <id>ossrh</id>
      <activation>
        <activeByDefault>true</activeByDefault>
      </activation>
      <properties>
        <gpg.executable>gpg</gpg.executable>
        <gpg.passphrase>YOUR_GPG_PASSPHRASE</gpg.passphrase>
      </properties>
    </profile>
  </profiles>
</settings>
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

4. **Release**:
   - Log in to https://oss.sonatype.org/
   - Navigate to Staging Repositories
   - Find your repository, close it, then release it

## GitHub Actions (Automated)

The project includes a GitHub Actions workflow for automated releases. To use it:

1. Add secrets to GitHub repository:
   - `OSSRH_USERNAME`: Sonatype username
   - `OSSRH_PASSWORD`: Sonatype password  
   - `GPG_PRIVATE_KEY`: GPG private key (base64 encoded)
   - `GPG_PASSPHRASE`: GPG key passphrase

2. Create a GitHub release with tag `java-v*` (e.g., `java-v2.1.0`)

3. The workflow will automatically build, sign, and deploy to Maven Central

## Version Guidelines

- Use semantic versioning: `MAJOR.MINOR.PATCH`
- Keep version in sync with main project version
- Tag releases as `java-vX.Y.Z`
