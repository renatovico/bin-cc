# Credit Card Identifier - Ruby Library

Ruby library for credit card BIN validation using bin-cc data.

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
puts brand  # 'visa'

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
puts brand  # 'visa'

# Check if supported
supported = validator.supported?('4012001037141112')
puts supported  # true

# Validate CVV
valid = validator.validate_cvv('123', 'visa')
puts valid  # true

# Get brand info
info = validator.get_brand_info('visa')
puts info['regexpBin']

# List all brands
brands = validator.list_brands
puts brands  # ['elo', 'diners', 'visa', ...]
```

## API

### Module Methods

#### `CreditcardIdentifier.find_brand(card_number)`
Identify the credit card brand.

**Parameters:**
- `card_number` (String): The credit card number

**Returns:** (String, nil) Brand name (e.g., 'visa', 'mastercard') or nil if not found

#### `CreditcardIdentifier.supported?(card_number)`
Check if the card number is supported.

**Parameters:**
- `card_number` (String): The credit card number

**Returns:** (Boolean) true if supported, false otherwise

### Validator Class

#### `initialize(data_path = nil)`
Initialize validator with brand data.

**Parameters:**
- `data_path` (String, nil): Path to brands.json. If nil, uses bundled data.

#### `find_brand(card_number)`
Identify the credit card brand.

**Parameters:**
- `card_number` (String): The credit card number

**Returns:** (String, nil) Brand name or nil if not found

#### `supported?(card_number)`
Check if card number is supported.

**Parameters:**
- `card_number` (String): The credit card number

**Returns:** (Boolean) true if supported, false otherwise

#### `validate_cvv(cvv, brand_name)`
Validate CVV for a specific brand.

**Parameters:**
- `cvv` (String): CVV code
- `brand_name` (String): Brand name (e.g., 'visa', 'mastercard')

**Returns:** (Boolean) true if valid, false otherwise

#### `get_brand_info(brand_name)`
Get information about a specific brand.

**Parameters:**
- `brand_name` (String): Brand name

**Returns:** (Hash, nil) Brand information or nil if not found

#### `list_brands`
List all supported brands.

**Returns:** (Array<String>) List of brand names

## Data Source

This library uses the BIN data from the [bin-cc project](https://github.com/renatovico/bin-cc).

The data is bundled with the gem, and can be updated by installing a newer version.

## Development

After checking out the repo, run `bundle install` to install dependencies.

Run tests with:

```bash
ruby test/test_validator.rb
```

## License

MIT
