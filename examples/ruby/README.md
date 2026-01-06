# Credit Card Validator - Ruby Example

Ruby example showing how to use the creditcard-identifier gem.

For the full library implementation, see: [`../../libs/ruby/`](../../libs/ruby/)

## Installation

```bash
gem install creditcard-identifier
```

## Running This Example

```bash
ruby credit_card_validator.rb
```

## Features Demonstrated

- Using module-level methods
- Using the Validator class
- Brand identification
- CVV validation
- Getting brand information

## Example

```ruby
require 'creditcard_identifier'

# Identify brand
brand = CreditcardIdentifier.find_brand('4012001037141112')
puts brand  # 'visa'

# Check if supported
supported = CreditcardIdentifier.supported?('4012001037141112')
puts supported  # true
```

## Documentation

For complete API documentation, see the [Ruby library README](../../libs/ruby/README.md).
