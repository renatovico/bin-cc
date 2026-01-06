# Credit Card Validator - Elixir Example

Elixir example showing how to use the creditcard_identifier library.

For the full library implementation, see: [`../../libs/elixir/`](../../libs/elixir/)

## Installation

Add to your `mix.exs`:

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

## Running This Example

```bash
# In iex
iex credit_card_validator.ex
iex> CreditCardValidatorExample.run()
```

## Features Demonstrated

- Using module-level functions
- Loading and using brand data
- Brand identification
- CVV validation
- Getting brand information

## Example

```elixir
# Identify brand
brand = CreditcardIdentifier.find_brand("4012001037141112")
IO.puts(brand)  # "visa"

# Check if supported
supported = CreditcardIdentifier.supported?("4012001037141112")
IO.puts(supported)  # true
```

## Documentation

For complete API documentation, see the [Elixir library README](../../libs/elixir/README.md).
