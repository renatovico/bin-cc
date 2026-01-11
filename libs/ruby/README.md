# Credit Card Identifier - Ruby Library

Ruby library for credit card BIN validation and identification.

## Supported Card Brands

- American Express (amex)
- Aura
- BaneseCard
- Diners Club
- Discover
- Elo
- Hipercard
- JCB
- Maestro
- Mastercard
- UnionPay
- Visa

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'creditcard-identifier'
```

And then execute:

```bash
bundle install
```

Or install it yourself as:

```bash
gem install creditcard-identifier
```

## Usage

### Module-level Functions

```ruby
require 'creditcard_identifier'

# Identify card brand
brand = CreditcardIdentifier.find_brand('4012001037141112')
puts brand[:name]  # 'visa'

# Check if card is supported
supported = CreditcardIdentifier.supported?('4012001037141112')
puts supported  # true
```

### Using the Validator Class

```ruby
require 'creditcard_identifier'

validator = CreditcardIdentifier::Validator.new

# Identify brand
brand = validator.find_brand('4012001037141112')
puts brand[:name]  # 'visa'

# Get detailed brand info
detailed = validator.find_brand('4012001037141112', detailed: true)
puts detailed[:scheme]  # 'visa'
puts detailed[:matched_pattern]  # { bin: '^4', length: [13, 16, 19], ... }

# Check if supported
supported = validator.supported?('4012001037141112')
puts supported  # true

# Validate CVV
valid = validator.validate_cvv('123', 'visa')
puts valid  # true

# Get brand info
info = validator.get_brand_info('visa')
puts info[:regexp_bin]

# Get detailed brand info
detailed = validator.get_brand_info_detailed('amex')
puts detailed

# List all brands
brands = validator.list_brands
puts brands
# ['amex', 'aura', 'banesecard', 'diners', 'discover', 'elo', 'hipercard', 'jcb', 'maestro', 'mastercard', 'unionpay', 'visa']

# Validate card number using Luhn algorithm
is_valid = CreditcardIdentifier.luhn('4012001037141112')
puts is_valid  # true

# Or using validator instance
is_valid = validator.luhn('4012001037141112')
puts is_valid  # true
```

## API

### Module Methods

#### `CreditcardIdentifier.find_brand(card_number)`
Identify the credit card brand.

**Parameters:**
- `card_number` (String): The credit card number

**Returns:** (Hash, nil) Brand hash or nil if not found

#### `CreditcardIdentifier.supported?(card_number)`
Check if the card number is supported.

**Parameters:**
- `card_number` (String): The credit card number

**Returns:** (Boolean) true if supported, false otherwise

### Validator Class

#### `initialize`
Initialize validator with embedded brand data.

#### `find_brand(card_number, detailed: false)`
Identify the credit card brand.

**Parameters:**
- `card_number` (String): The credit card number
- `detailed` (Boolean): If true, returns detailed brand info with matched pattern

**Returns:** (Hash, nil) Brand hash or nil if not found

#### `supported?(card_number)`
Check if card number is supported.

**Parameters:**
- `card_number` (String): The credit card number

**Returns:** (Boolean) true if supported, false otherwise

#### `validate_cvv(cvv, brand_or_name)`
Validate CVV for a specific brand.

**Parameters:**
- `cvv` (String): CVV code
- `brand_or_name` (String | Hash): Brand name or brand hash from find_brand

**Returns:** (Boolean) true if valid, false otherwise

#### `get_brand_info(brand_name)`
Get information about a specific brand.

**Parameters:**
- `brand_name` (String): Brand name

**Returns:** (Hash, nil) Brand information or nil if not found

#### `get_brand_info_detailed(scheme)`
Get detailed information about a specific brand.

**Parameters:**
- `scheme` (String): Scheme name (e.g., 'visa', 'mastercard')

**Returns:** (Hash, nil) Detailed brand information or nil if not found

#### `list_brands`
List all supported brands.

**Returns:** (Array<String>) List of brand names

#### `luhn(number)`
Validate a credit card number using the Luhn algorithm.

**Parameters:**
- `number` (String): Credit card number (digits only)

**Returns:** (Boolean) true if valid according to Luhn algorithm

**Raises:** TypeError if input is not a string

## Data Source

This library uses the BIN data from the [bin-cc project](https://github.com/renatovico/bin-cc).

The data is embedded directly in the gem for optimal performance.

## Development

After checking out the repo, run `bundle install` to install dependencies.

Run tests with:

```bash
bundle exec ruby test/test_validator.rb
```

## License

MIT
