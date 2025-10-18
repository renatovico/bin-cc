# Credit Card Validator - Ruby Example

Ruby implementation showing how to use the bin-cc data file project.

## Usage

```bash
ruby credit_card_validator.rb
```

## Requirements

- Ruby 2.5+
- No external gems (uses only standard library)

## Features

- Load brand data from JSON
- Identify credit card brand
- Validate CVV codes
- Check if card is supported
- Get brand information

## Example

```ruby
require_relative 'credit_card_validator'

validator = CreditCardValidator.new

# Identify brand
brand = validator.find_brand('4012001037141112')
puts brand  # 'visa'

# Check if supported
supported = validator.supported?('4012001037141112')
puts supported  # true

# Validate CVV
valid = validator.validate_cvv('123', 'visa')
puts valid  # true
```

## Data Source

Loads data from [`../../data/brands.json`](../../data/brands.json)
