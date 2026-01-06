defmodule CreditCardValidatorExample do
  @moduledoc """
  Credit Card Validator - Elixir Example
  
  This module shows how to use the creditcard_identifier library.
  For the full library implementation, see: libs/elixir/
  """

  # In production, you would add to mix.exs:
  # {:creditcard_identifier, "~> 1.0"}

  # For development/testing, add parent lib to code path
  def setup_lib_path do
    lib_path = Path.expand("../../libs/elixir", __DIR__)
    Code.prepend_path(Path.join(lib_path, "_build/dev/lib/creditcard_identifier/ebin"))
  end

  @doc """
  Run the example demonstrations.
  """
  def run do
    IO.puts("=== Credit Card Validator - Elixir Example ===\n")
    
    # Using module-level functions
    IO.puts("Using module-level functions:")
    IO.puts("Brand of 4012001037141112: #{CreditcardIdentifier.find_brand("4012001037141112")}")
    IO.puts("Is supported: #{CreditcardIdentifier.supported?("4012001037141112")}\n")
    
    # Load brands for explicit use
    brands = CreditcardIdentifier.load_brands()
    
    # Example 1: List all brands
    brand_names = CreditcardIdentifier.list_brands(brands)
    IO.puts("Supported brands: #{Enum.join(brand_names, ", ")}\n")
    
    # Example 2: Identify card brands
    test_cards = %{
      "4012001037141112" => "visa",
      "5533798818319497" => "mastercard",
      "378282246310005" => "amex",
      "6011236044609927" => "discover"
    }
    
    IO.puts("Card brand identification:")
    Enum.each(test_cards, fn {card, expected} ->
      brand = CreditcardIdentifier.find_brand(card, brands)
      status = if brand == expected, do: "✓", else: "✗"
      IO.puts("#{status} #{card}: #{brand} (expected: #{expected})")
    end)
    IO.puts("")
    
    # Example 3: CVV validation
    IO.puts("CVV validation:")
    IO.puts("Visa CVV 123: #{CreditcardIdentifier.validate_cvv("123", "visa", brands)}")
    IO.puts("Amex CVV 1234: #{CreditcardIdentifier.validate_cvv("1234", "amex", brands)}")
    IO.puts("Visa CVV 12: #{CreditcardIdentifier.validate_cvv("12", "visa", brands)} (invalid)\n")
    
    # Example 4: Get brand details
    IO.puts("Visa brand details:")
    case CreditcardIdentifier.get_brand_info("visa", brands) do
      nil -> IO.puts("  Not found")
      visa_info ->
        IO.puts("  BIN pattern: #{visa_info["regexpBin"]}")
        IO.puts("  Full pattern: #{visa_info["regexpFull"]}")
        IO.puts("  CVV pattern: #{visa_info["regexpCvv"]}")
    end
  end
end

# Uncomment to run the example:
# CreditCardValidatorExample.run()
