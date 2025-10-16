# Credit Card Validator - Python Example

Python implementation showing how to use the bin-cc data file project.

## Usage

```bash
python3 credit_card_validator.py
```

## Requirements

- Python 3.6+
- No external dependencies (uses only standard library)

## Features

- Load brand data from JSON
- Identify credit card brand
- Validate CVV codes
- Check if card is supported
- Get brand information

## Example

```python
from credit_card_validator import CreditCardValidator

validator = CreditCardValidator()

# Identify brand
brand = validator.find_brand('4012001037141112')
print(brand)  # 'visa'

# Check if supported
supported = validator.is_supported('4012001037141112')
print(supported)  # True

# Validate CVV
valid = validator.validate_cvv('123', 'visa')
print(valid)  # True
```

## Data Source

Loads data from [`../../data/brands.json`](../../data/brands.json)
