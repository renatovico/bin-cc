# Credit Card Identifier - Python Library

Python library for credit card BIN validation and identification.

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

```bash
pip install creditcard-identifier
```

## Usage

### Module Functions

```python
from creditcard_identifier import find_brand, is_supported

# Identify card brand
brand = find_brand('4012001037141112')
print(brand)  # {'name': 'visa', 'regexp_bin': '...', ...}

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
print(brand['name'])  # 'visa'

# Get detailed brand info
detailed = validator.find_brand('4012001037141112', detailed=True)
print(detailed['scheme'])  # 'visa'
print(detailed['matched_pattern'])  # {'bin': '^4', 'length': [13, 16, 19], ...}

# Check if supported
supported = validator.is_supported('4012001037141112')
print(supported)  # True

# Validate CVV
valid = validator.validate_cvv('123', 'visa')
print(valid)  # True

# Get brand info
info = validator.get_brand_info('visa')
print(info['regexp_bin'])

# Get detailed brand info
detailed = validator.get_brand_info_detailed('amex')
print(detailed)

# List all brands
brands = validator.list_brands()
print(brands)
# ['amex', 'aura', 'banesecard', 'diners', 'discover', 'elo', 'hipercard', 'jcb', 'maestro', 'mastercard', 'unionpay', 'visa']

# Validate card number using Luhn algorithm
from creditcard_identifier.validator import luhn
is_valid = luhn('4012001037141112')
print(is_valid)  # True

# Or using validator instance
is_valid = validator.luhn('4012001037141112')
print(is_valid)  # True
```

## API

### Module Functions

#### `find_brand(card_number, detailed=False)`
Identify the credit card brand.

**Parameters:**
- `card_number` (str): The credit card number
- `detailed` (bool): If True, returns detailed brand info (default: False)

**Returns:** (dict) Brand dict or None if not found

#### `is_supported(card_number)`
Check if the card number is supported.

**Parameters:**
- `card_number` (str): The credit card number

**Returns:** (bool) True if supported, False otherwise

### CreditCardValidator Class

#### `__init__()`
Initialize validator with embedded brand data.

#### `find_brand(card_number, detailed=False)`
Identify the credit card brand.

**Parameters:**
- `card_number` (str): The credit card number
- `detailed` (bool): If True, returns detailed brand info with matched pattern

**Returns:** (dict) Brand dict or None if not found

#### `is_supported(card_number)`
Check if card number is supported.

**Parameters:**
- `card_number` (str): The credit card number

**Returns:** (bool) True if supported, False otherwise

#### `validate_cvv(cvv, brand_or_name)`
Validate CVV for a specific brand.

**Parameters:**
- `cvv` (str): CVV code
- `brand_or_name` (str | dict): Brand name or brand dict from find_brand

**Returns:** (bool) True if valid, False otherwise

#### `get_brand_info(brand_name)`
Get information about a specific brand.

**Parameters:**
- `brand_name` (str): Brand name

**Returns:** (dict) Brand information or None if not found

#### `get_brand_info_detailed(scheme)`
Get detailed information about a specific brand.

**Parameters:**
- `scheme` (str): Scheme name (e.g., 'visa', 'mastercard')

**Returns:** (dict) Detailed brand information or None if not found

#### `list_brands()`
List all supported brands.

**Returns:** (list) List of brand names

#### `luhn(number)`
Validate a credit card number using the Luhn algorithm.

**Parameters:**
- `number` (str): Credit card number (digits only)

**Returns:** (bool) True if valid according to Luhn algorithm

**Raises:** TypeError if input is not a string

## Data Source

This library uses the BIN data from the [bin-cc project](https://github.com/renatovico/bin-cc).

The data is embedded directly in the package for optimal performance.

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
