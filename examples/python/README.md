# Credit Card Validator - Python Example

Python example showing how to use the creditcard-identifier library.

For the full library implementation, see: [`../../libs/python/`](../../libs/python/)

## Installation

```bash
pip install creditcard-identifier
```

## Running This Example

```bash
python3 credit_card_validator.py
```

## Features Demonstrated

- Using module-level functions
- Using the Validator class
- Brand identification
- CVV validation
- Getting brand information

## Example

```python
from creditcard_identifier import find_brand, is_supported

# Identify brand
brand = find_brand('4012001037141112')
print(brand)  # 'visa'

# Check if supported
supported = is_supported('4012001037141112')
print(supported)  # True
```

## Documentation

For complete API documentation, see the [Python library README](../../libs/python/README.md).
