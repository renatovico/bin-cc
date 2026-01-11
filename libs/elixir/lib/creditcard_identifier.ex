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

  alias CreditcardIdentifier.Data

  @doc """
  Get all brand data.

  ## Returns
    List of brand maps with pre-compiled regex patterns
  """
  def get_brands do
    Data.brands()
  end

  @doc """
  Identify the credit card brand.

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
  Identify the credit card brand with custom brands list.

  ## Parameters
    - card_number: Credit card number as string
    - brands: List of brand data

  ## Returns
    Brand name (string) or nil if not found
  """
  def find_brand(card_number, brands) do
    brands
    |> Enum.find(fn brand ->
      Regex.match?(brand.regexp_full, card_number)
    end)
    |> case do
      nil -> nil
      brand -> brand.name
    end
  end

  @doc """
  Check if card number is supported.

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
  Check if card number is supported with custom brands list.

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
  Validate CVV for a specific brand.

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
  Validate CVV for a specific brand with custom brands list.

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
      brand -> Regex.match?(brand.regexp_cvv, cvv)
    end
  end

  @doc """
  Get information about a specific brand.

  ## Parameters
    - brand_name: Brand name (e.g., "visa", "mastercard")

  ## Returns
    Brand map or nil if not found
  """
  def get_brand_info(brand_name) do
    get_brand_info(brand_name, get_brands())
  end

  @doc """
  Get information about a specific brand with custom brands list.

  ## Parameters
    - brand_name: Brand name (e.g., "visa", "mastercard")
    - brands: List of brand data

  ## Returns
    Brand map or nil if not found
  """
  def get_brand_info(brand_name, brands) do
    Enum.find(brands, fn brand -> brand.name == brand_name end)
  end

  @doc """
  List all supported brands.

  ## Returns
    List of brand names
  """
  def list_brands do
    list_brands(get_brands())
  end

  @doc """
  List all supported brands from custom brands list.

  ## Parameters
    - brands: List of brand data

  ## Returns
    List of brand names
  """
  def list_brands(brands) do
    Enum.map(brands, fn brand -> brand.name end)
  end
end
