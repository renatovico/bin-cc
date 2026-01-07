defmodule CreditcardIdentifier do
  @moduledoc """
  Credit Card BIN Validator

  This module provides credit card validation using bin-cc data.

  ## Examples

      iex> CreditcardIdentifier.find_brand("4012001037141112")
      "visa"

      iex> CreditcardIdentifier.supported?("4012001037141112")
      true

  """

  @doc """
  Load brand data from JSON file.

  ## Parameters
    - data_path: Path to brands.json (optional, uses bundled data if nil)

  ## Returns
    List of brand maps
  """
  def load_brands(data_path \\ nil) do
    path = data_path || find_data_path()

    path
    |> File.read!()
    |> Jason.decode!()
  end

  @doc """
  Identify the credit card brand using cached brands data.

  ## Parameters
    - card_number: Credit card number as string

  ## Returns
    Brand name (string) or nil if not found

  ## Examples

      iex> CreditcardIdentifier.find_brand("4012001037141112")
      "visa"

  """
  def find_brand(card_number) do
    find_brand(card_number, get_brands())
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
  Check if card number is supported using cached brands data.

  ## Parameters
    - card_number: Credit card number as string

  ## Returns
    true if supported, false otherwise

  ## Examples

      iex> CreditcardIdentifier.supported?("4012001037141112")
      true

  """
  def supported?(card_number) do
    supported?(card_number, get_brands())
  end

  @doc """
  Check if card number is supported.

  ## Parameters
    - card_number: Credit card number as string
    - brands: List of brand data

  ## Returns
    true if supported, false otherwise
  """
  def supported?(card_number, brands) do
    find_brand(card_number, brands) != nil
  end

  @doc """
  Validate CVV for a specific brand using cached brands data.

  ## Parameters
    - cvv: CVV code as string
    - brand_name: Brand name (e.g., "visa", "mastercard")

  ## Returns
    true if valid, false otherwise
  """
  def validate_cvv(cvv, brand_name) do
    validate_cvv(cvv, brand_name, get_brands())
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
  Get information about a specific brand using cached brands data.

  ## Parameters
    - brand_name: Brand name (e.g., "visa", "mastercard")

  ## Returns
    Brand map or nil if not found
  """
  def get_brand_info(brand_name) do
    get_brand_info(brand_name, get_brands())
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
  List all supported brands using cached brands data.

  ## Returns
    List of brand names
  """
  def list_brands do
    list_brands(get_brands())
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

  # Private helpers

  defp get_brands do
    case Process.get(:creditcard_brands) do
      nil ->
        brands = load_brands()
        Process.put(:creditcard_brands, brands)
        brands
      brands ->
        brands
    end
  end

  defp find_data_path do
    # Look for bundled data in package
    app_dir = Application.app_dir(:creditcard_identifier)
    data_path = Path.join([app_dir, "priv", "data", "brands.json"])

    # Fallback to development path
    if File.exists?(data_path) do
      data_path
    else
      # For development - look relative to this file
      Path.join([__DIR__, "..", "data", "brands.json"])
    end
  end
end
