# Credit Card Identifier - Elixir Library

Elixir library for credit card BIN validation using bin-cc data.

## Installation

Add `creditcard_identifier` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:creditcard_identifier, "~> 1.0"}
  ]
end
```

Then run:

```bash
mix deps.get
```

## Usage

### Basic Functions

```elixir
# Identify card brand
brand = CreditcardIdentifier.find_brand("4012001037141112")
IO.puts(brand)  # "visa"

# Check if card is supported
supported = CreditcardIdentifier.supported?("4012001037141112")
IO.puts(supported)  # true

# Validate CVV
valid = CreditcardIdentifier.validate_cvv("123", "visa")
IO.puts(valid)  # true

# Get brand info
info = CreditcardIdentifier.get_brand_info("visa")
IO.puts(info["regexpBin"])

# List all brands
brands = CreditcardIdentifier.list_brands()
IO.inspect(brands)  # ["elo", "diners", "visa", ...]
```

### Working with Custom Data

If you need to work with custom brand data or multiple datasets:

```elixir
# Load custom data
brands = CreditcardIdentifier.load_brands("/path/to/brands.json")

# Use with explicit brands parameter
brand = CreditcardIdentifier.find_brand("4012001037141112", brands)
supported = CreditcardIdentifier.supported?("4012001037141112", brands)
valid = CreditcardIdentifier.validate_cvv("123", "visa", brands)
```

## API

### Functions

#### `find_brand(card_number)`
Identify the credit card brand.

**Parameters:**
- `card_number` (String): The credit card number

**Returns:** (String) Brand name (e.g., "visa", "mastercard") or nil if not found

#### `find_brand(card_number, brands)`
Identify the credit card brand with custom brands data.

**Parameters:**
- `card_number` (String): The credit card number
- `brands` (List): Brand data list

**Returns:** (String) Brand name or nil if not found

#### `supported?(card_number)`
Check if the card number is supported.

**Parameters:**
- `card_number` (String): The credit card number

**Returns:** (Boolean) true if supported, false otherwise

#### `supported?(card_number, brands)`
Check if the card number is supported with custom brands data.

**Parameters:**
- `card_number` (String): The credit card number
- `brands` (List): Brand data list

**Returns:** (Boolean) true if supported, false otherwise

#### `validate_cvv(cvv, brand_name)`
Validate CVV for a specific brand.

**Parameters:**
- `cvv` (String): CVV code
- `brand_name` (String): Brand name (e.g., "visa", "mastercard")

**Returns:** (Boolean) true if valid, false otherwise

#### `validate_cvv(cvv, brand_name, brands)`
Validate CVV with custom brands data.

**Parameters:**
- `cvv` (String): CVV code
- `brand_name` (String): Brand name
- `brands` (List): Brand data list

**Returns:** (Boolean) true if valid, false otherwise

#### `get_brand_info(brand_name)`
Get information about a specific brand.

**Parameters:**
- `brand_name` (String): Brand name

**Returns:** (Map) Brand information or nil if not found

#### `get_brand_info(brand_name, brands)`
Get information with custom brands data.

**Parameters:**
- `brand_name` (String): Brand name
- `brands` (List): Brand data list

**Returns:** (Map) Brand information or nil if not found

#### `list_brands()`
List all supported brands.

**Returns:** (List) List of brand names

#### `list_brands(brands)`
List all brands from custom data.

**Parameters:**
- `brands` (List): Brand data list

**Returns:** (List) List of brand names

#### `load_brands(data_path \\ nil)`
Load brand data from JSON file.

**Parameters:**
- `data_path` (String, optional): Path to brands.json. If nil, uses bundled data.

**Returns:** (List) Brand data list

## Data Source

This library uses the BIN data from the [bin-cc project](https://github.com/renatovico/bin-cc).

The data is bundled with the package, and can be updated by installing a newer version.

## Development

Run tests:

```bash
mix test
```

## License

MIT
