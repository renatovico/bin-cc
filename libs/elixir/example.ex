defmodule CreditCardValidatorExample do
  @moduledoc """
  Credit Card Validator - Elixir Example

  This module shows how to use the creditcard_identifier library.

  In production, add to mix.exs:
  {:creditcard_identifier, "~> 2.0"}
  """

  @doc """
  Run the example demonstrations.
  """
  def run do
    IO.puts("=== Credit Card Validator - Elixir Example ===\n")

    # Example 1: List all brands
    brand_names = CreditcardIdentifier.list_brands()
    IO.puts("Supported brands: #{Enum.join(brand_names, ", ")}\n")

    # Example 2: Identify card brands
    test_cards = %{
      "4012001037141112" => "visa",
      "5533798818319497" => "mastercard",
      "378282246310005" => "amex",
      "6011236044609927" => "discover",
      "6362970000457013" => "elo",
      "6062825624254001" => "hipercard",
      "6220123456789012" => "unionpay",
      "6759123456789012" => "maestro"
    }

    IO.puts("Card brand identification:")
    Enum.each(test_cards, fn {card, expected} ->
      brand = CreditcardIdentifier.find_brand(card)
      brand_name = if brand, do: brand.name, else: nil
      status = if brand_name == expected, do: "✓", else: "✗"
      IO.puts("#{status} #{card}: #{brand_name} (expected: #{expected})")
    end)
    IO.puts("")

    # Example 3: Check if card is supported
    IO.puts("Check if card is supported:")
    IO.puts("Visa card supported: #{CreditcardIdentifier.supported?("4012001037141112")}")
    IO.puts("Invalid card supported: #{CreditcardIdentifier.supported?("1234567890123456")}\n")

    # Example 4: CVV validation
    IO.puts("CVV validation:")
    IO.puts("Visa CVV 123: #{CreditcardIdentifier.validate_cvv("123", "visa")}")
    IO.puts("Amex CVV 1234: #{CreditcardIdentifier.validate_cvv("1234", "amex")}")
    IO.puts("Visa CVV 12: #{CreditcardIdentifier.validate_cvv("12", "visa")} (invalid)\n")

    # Example 5: Get brand details
    IO.puts("Visa brand details:")
    case CreditcardIdentifier.get_brand_info("visa") do
      nil -> IO.puts("  Not found")
      visa_info ->
        IO.puts("  Name: #{visa_info.name}")
        IO.puts("  Regexp Full: #{inspect(visa_info.regexp_full)}")
        IO.puts("  Regexp CVV: #{inspect(visa_info.regexp_cvv)}")
    end
    IO.puts("")

    # Example 6: Get detailed brand information
    IO.puts("Visa detailed info:")
    case CreditcardIdentifier.get_brand_info_detailed("visa") do
      nil -> IO.puts("  Not found")
      detail ->
        IO.puts("  Scheme: #{detail.scheme}")
        IO.puts("  Issuer name: #{detail.issuer_name}")
        IO.puts("  Type: #{detail.type}")
        IO.puts("  Country: #{detail.country}")
    end
    IO.puts("")

    # Example 7: Find brand with detailed info
    IO.puts("Find brand with detailed info:")
    case CreditcardIdentifier.find_brand("4012001037141112", detailed: true) do
      nil -> IO.puts("  Not found")
      brand ->
        IO.puts("  Scheme: #{brand.scheme}")
        IO.puts("  Issuer: #{brand.issuer_name}")
        IO.puts("  Type: #{brand.type}")
        if brand.matched_pattern do
          IO.puts("  Matched pattern: #{brand.matched_pattern.bin}")
        end
    end
  end
end

# To run the example:
# mix compile
# iex -S mix
# CreditCardValidatorExample.run()
