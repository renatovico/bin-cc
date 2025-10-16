defmodule CreditCardValidator do
  @moduledoc """
  Credit Card BIN Validator - Elixir Example
  
  This module shows how to use the bin-cc data file project in Elixir.
  It loads the brands.json file and performs credit card validation.
  """

  @doc """
  Load brand data from JSON file.
  
  ## Parameters
    - data_path: Path to brands.json (optional, uses default if nil)
  
  ## Returns
    List of brand maps
  """
  def load_brands(data_path \\ nil) do
    path = data_path || Path.join([__DIR__, "../../data/brands.json"])
    
    path
    |> File.read!()
    |> Jason.decode!()
  end

  @doc """
  Identify the credit card brand.
  
  ## Parameters
    - card_number: Credit card number as string
    - brands: List of brand data
  
  ## Returns
    Brand name (string) or nil if not found
  """
  def find_brand(card_number, brands) do
    brands
    |> Enum.find(fn brand ->
      {:ok, regex} = Regex.compile(brand["regexpFull"])
      Regex.match?(regex, card_number)
    end)
    |> case do
      nil -> nil
      brand -> brand["name"]
    end
  end

  @doc """
  Check if card number is supported.
  
  ## Parameters
    - card_number: Credit card number as string
    - brands: List of brand data
  
  ## Returns
    true if supported, false otherwise
  """
  def is_supported?(card_number, brands) do
    find_brand(card_number, brands) != nil
  end

  @doc """
  Validate CVV for a specific brand.
  
  ## Parameters
    - cvv: CVV code as string
    - brand_name: Brand name (e.g., "visa", "mastercard")
    - brands: List of brand data
  
  ## Returns
    true if valid, false otherwise
  """
  def validate_cvv(cvv, brand_name, brands) do
    case get_brand_info(brand_name, brands) do
      nil -> false
      brand ->
        {:ok, regex} = Regex.compile(brand["regexpCvv"])
        Regex.match?(regex, cvv)
    end
  end

  @doc """
  Get information about a specific brand.
  
  ## Parameters
    - brand_name: Brand name (e.g., "visa", "mastercard")
    - brands: List of brand data
  
  ## Returns
    Brand map or nil if not found
  """
  def get_brand_info(brand_name, brands) do
    Enum.find(brands, fn brand -> brand["name"] == brand_name end)
  end

  @doc """
  List all supported brands.
  
  ## Parameters
    - brands: List of brand data
  
  ## Returns
    List of brand names
  """
  def list_brands(brands) do
    Enum.map(brands, fn brand -> brand["name"] end)
  end
end

# Example usage
defmodule Example do
  def run do
    IO.puts("=== Credit Card Validator - Elixir Example ===\n")
    
    brands = CreditCardValidator.load_brands()
    
    # Example 1: List all brands
    brand_names = CreditCardValidator.list_brands(brands)
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
      brand = CreditCardValidator.find_brand(card, brands)
      status = if brand, do: "✓", else: "✗"
      IO.puts("#{status} #{card}: #{brand} (expected: #{expected})")
    end)
    IO.puts("")
    
    # Example 3: CVV validation
    IO.puts("CVV validation:")
    IO.puts("Visa CVV 123: #{CreditCardValidator.validate_cvv("123", "visa", brands)}")
    IO.puts("Amex CVV 1234: #{CreditCardValidator.validate_cvv("1234", "amex", brands)}")
    IO.puts("Visa CVV 12: #{CreditCardValidator.validate_cvv("12", "visa", brands)} (invalid)\n")
    
    # Example 4: Get brand details
    IO.puts("Visa brand details:")
    case CreditCardValidator.get_brand_info("visa", brands) do
      nil -> IO.puts("  Not found")
      visa_info ->
        IO.puts("  BIN pattern: #{visa_info["regexpBin"]}")
        IO.puts("  Full pattern: #{visa_info["regexpFull"]}")
        IO.puts("  CVV pattern: #{visa_info["regexpCvv"]}")
    end
  end
end

# Run the example if this file is executed directly
# Example.run()
