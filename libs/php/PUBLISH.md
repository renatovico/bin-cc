# Publishing PHP Package to Packagist

This guide explains how to publish the PHP library to Packagist.

## Prerequisites

1. **Packagist Account**: Create an account at https://packagist.org/
2. **GitHub Repository**: Package must be in a public GitHub repository

## Setup

1. **Submit Package**:
   - Go to https://packagist.org/packages/submit
   - Enter repository URL: `https://github.com/renatovico/bin-cc`
   - Packagist will automatically detect the package

2. **Enable Auto-Update**:
   - Set up GitHub webhook for automatic updates
   - Or manually update package after each release

## Publishing Steps

1. **Update Version**: Update version in `composer.json`

2. **Test**:
   ```bash
   cd libs/php
   composer install
   vendor/bin/phpunit
   ```

3. **Commit and Tag**:
   ```bash
   git add composer.json
   git commit -m "Release PHP package v2.1.0"
   git tag php-v2.1.0
   git push origin php-v2.1.0
   ```

4. **Packagist Auto-Update**:
   - If webhook is configured, Packagist will automatically detect the new tag
   - Otherwise, manually update at https://packagist.org/packages/creditcard/identifier

## GitHub Actions (Automated)

The project includes a GitHub Actions workflow for automated releases. To use it:

1. Create a GitHub release with tag `php-v*` (e.g., `php-v2.1.0`)

2. The workflow will automatically:
   - Run tests
   - Create the Git tag
   - Trigger Packagist update (if webhook configured)

## Usage by Others

Users can install via Composer:

```bash
composer require creditcard/identifier
```

Use in code:
```php
<?php
require 'vendor/autoload.php';

use CreditCard\Identifier\CreditCardValidator;

$validator = new CreditCardValidator();
$brand = $validator->findBrand('4012001037141112');
echo $brand; // "visa"
```

## Version Guidelines

- Use semantic versioning: `MAJOR.MINOR.PATCH`
- Keep version in sync with main project version
- Tag releases as `php-vX.Y.Z`
- Update version in `composer.json`

## Package Name

- Package name: `creditcard/identifier`
- Namespace: `CreditCard\Identifier`

## Documentation

Add comprehensive documentation in README.md, which Packagist will display on the package page.
