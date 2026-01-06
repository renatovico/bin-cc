# Credit Card Identifier - Python Library

Python library for credit card BIN validation using bin-cc data.

## Installation

```bash
pip install creditcard-identifier
```

## Usage

### Basic Validation

```python
from creditcard_identifier import find_brand, is_supported

# Identify card brand
brand = find_brand('4012001037141112')
print(brand)  # 'visa'

# Check if card is supported
supported = is_supported('4012001037141112')
print(supported)  # True
```

### Using the Validator Class

```python
from creditcard_identifier import CreditCardValidator

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

# Get brand info
info = validator.get_brand_info('visa')
print(info['regexpBin'])

# List all brands
brands = validator.list_brands()
print(brands)  # ['elo', 'diners', 'visa', ...]
```

## API

### Module Functions

#### `find_brand(card_number)`
Identify the credit card brand.

**Parameters:**
- `card_number` (str): The credit card number

**Returns:** (str) Brand name (e.g., 'visa', 'mastercard') or None if not found

#### `is_supported(card_number)`
Check if the card number is supported.

**Parameters:**
- `card_number` (str): The credit card number

**Returns:** (bool) True if supported, False otherwise

### CreditCardValidator Class

#### `__init__(data_path=None)`
Initialize validator with brand data.

**Parameters:**
- `data_path` (str, optional): Path to brands.json. If None, uses bundled data.

#### `find_brand(card_number)`
Identify the credit card brand.

**Parameters:**
- `card_number` (str): The credit card number

**Returns:** (str) Brand name or None if not found

#### `is_supported(card_number)`
Check if card number is supported.

**Parameters:**
- `card_number` (str): The credit card number

**Returns:** (bool) True if supported, False otherwise

#### `validate_cvv(cvv, brand_name)`
Validate CVV for a specific brand.

**Parameters:**
- `cvv` (str): CVV code
- `brand_name` (str): Brand name (e.g., 'visa', 'mastercard')

**Returns:** (bool) True if valid, False otherwise

#### `get_brand_info(brand_name)`
Get information about a specific brand.

**Parameters:**
- `brand_name` (str): Brand name

**Returns:** (dict) Brand information or None if not found

#### `list_brands()`
List all supported brands.

**Returns:** (list) List of brand names

## Data Source

This library uses the BIN data from the [bin-cc project](https://github.com/renatovico/bin-cc).

The data is bundled with the package, and can be updated by installing a newer version of the package.

## Development

### Install in Development Mode

```bash
cd libs/python
pip install -e .
```

### Run Tests

```bash
python -m pytest tests/
```

## License

MIT
