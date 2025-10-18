# Credit Card Validator - Elixir Example

Elixir implementation showing how to use the bin-cc data file project.

## Requirements

- Elixir 1.10+
- Jason library for JSON parsing

Add to your `mix.exs`:
```elixir
{:jason, "~> 1.4"}
```

## Usage

```bash
# In iex
iex> c("credit_card_validator.ex")
iex> Example.run()
```

## Features

- Load brand data from JSON
- Identify credit card brand
- Validate CVV codes
- Check if card is supported
- Get brand information

## Example

```elixir
brands = CreditCardValidator.load_brands()

# Identify brand
brand = CreditCardValidator.find_brand("4012001037141112", brands)
IO.puts(brand)  # "visa"

# Check if supported
supported = CreditCardValidator.is_supported?("4012001037141112", brands)
IO.puts(supported)  # true

# Validate CVV
valid = CreditCardValidator.validate_cvv("123", "visa", brands)
IO.puts(valid)  # true
```

## Data Source

Loads data from [`../../data/brands.json`](../../data/brands.json)
