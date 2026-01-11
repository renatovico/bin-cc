# Credit Card Identifier - Elixir Library

Elixir library for credit card BIN validation and identification.

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

Add `creditcard_identifier` to your list of dependencies in `mix.exs`:

```elixir
def deps do
  [
    {:creditcard_identifier, "~> 2.0"}
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
IO.inspect(brand.name)  # "visa"

# Get detailed brand info
brand = CreditcardIdentifier.find_brand("4012001037141112", detailed: true)
IO.inspect(brand.scheme)  # "visa"
IO.inspect(brand.matched_pattern)  # %{bin: "^4", length: [13, 16, 19], ...}

# Check if card is supported
supported = CreditcardIdentifier.supported?("4012001037141112")
IO.puts(supported)  # true

# Validate CVV
valid = CreditcardIdentifier.validate_cvv("123", "visa")
IO.puts(valid)  # true

# Get brand info
info = CreditcardIdentifier.get_brand_info("visa")
IO.inspect(info.regexp_bin)

# Get detailed brand info
detailed = CreditcardIdentifier.get_brand_info_detailed("amex")
IO.inspect(detailed)

# List all brands
brands = CreditcardIdentifier.list_brands()
IO.inspect(brands)
# ["amex", "aura", "banesecard", "diners", "discover", "elo", "hipercard", "jcb", "maestro", "mastercard", "unionpay", "visa"]
```

### Accessing Raw Data

```elixir
# Get all brand data
brands = CreditcardIdentifier.get_brands()

# Get all detailed brand data
detailed_brands = CreditcardIdentifier.get_brands_detailed()
```

## API

### Functions

#### `find_brand(card_number, opts \\ [])`
Identify the credit card brand.

**Parameters:**
- `card_number` (String): The credit card number
- `opts` (Keyword): Options
  - `detailed` (Boolean): If true, returns detailed brand info (default: false)

**Returns:** Brand map or nil if not found. If `detailed: true`, includes `:matched_pattern` and `:matched_bin` fields.

#### `supported?(card_number)`
Check if the card number is supported.

**Parameters:**
- `card_number` (String): The credit card number

**Returns:** (Boolean) true if supported, false otherwise

#### `validate_cvv(cvv, brand_or_name)`
Validate CVV for a specific brand.

**Parameters:**
- `cvv` (String): CVV code
- `brand_or_name` (String | Map): Brand name or brand map from find_brand

**Returns:** (Boolean) true if valid, false otherwise

#### `get_brand_info(brand_name)`
Get information about a specific brand.

**Parameters:**
- `brand_name` (String): Brand name

**Returns:** (Map) Brand information or nil if not found

#### `get_brand_info_detailed(scheme)`
Get detailed information about a specific brand.

**Parameters:**
- `scheme` (String): Scheme name (e.g., "visa", "mastercard")

**Returns:** (Map) Detailed brand information or nil if not found

#### `list_brands()`
List all supported brands.

**Returns:** (List) List of brand names

#### `get_brands()`
Get all brand data.

**Returns:** (List) List of brand maps with pre-compiled regex patterns

#### `get_brands_detailed()`
Get all detailed brand data.

**Returns:** (List) List of detailed brand maps

## Data Source

This library uses the BIN data from the [bin-cc project](https://github.com/renatovico/bin-cc).

The data is embedded directly in the package at compile time for optimal performance.

## Development

Run tests:

```bash
mix test
```

## License

MIT
