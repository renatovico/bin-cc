# CreditCard Identifier - PHP

Credit Card BIN validation library using bin-cc data.

## Requirements

- PHP 8.0 or higher

## Installation

```bash
composer require creditcard/identifier
```

## Usage

```php
<?php

use CreditCard\Identifier\CreditCardValidator;

$validator = new CreditCardValidator();

// Find brand
$brand = $validator->findBrand('4012001037141112');
echo $brand; // "visa"

// Check if supported
$supported = $validator->isSupported('4012001037141112');
echo $supported; // true

// Validate CVV
$validCvv = $validator->validateCvv('123', 'visa');
echo $validCvv; // true

// Luhn validation
$validLuhn = CreditCardValidator::luhn('4012001037141112');
echo $validLuhn; // true
```

## Running the Example

```bash
php example.php
```

## Testing

```bash
# Install PHPUnit
composer install --dev

# Run tests
vendor/bin/phpunit
```

## Features

- **Brand Identification**: Identify card brand by BIN/IIN patterns
- **CVV Validation**: Validate CVV length for each brand
- **Luhn Algorithm**: Validate card numbers using Luhn checksum
- **Detailed Brand Info**: Get comprehensive brand information
- **Performance**: Pre-compiled regex patterns for fast validation
- **Type Safety**: Full type hints and return types

## Supported Brands

See [data/compiled/BRANDS.md](../../data/compiled/BRANDS.md) for the complete list.

## License

MIT License
