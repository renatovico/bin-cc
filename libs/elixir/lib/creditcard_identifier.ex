defmodule CreditcardIdentifier do
  @moduledoc """
  Credit Card BIN Validator

  This module provides credit card validation using bin-cc data.

  ## Examples

      iex> CreditcardIdentifier.find_brand("4012001037141112")
      %{name: "visa", ...}

      iex> CreditcardIdentifier.supported?("4012001037141112")
      true

  """

  alias CreditcardIdentifier.Data
  alias CreditcardIdentifier.DataDetailed

  @doc """
  Get all brand data.

  ## Returns
    List of brand maps with pre-compiled regex patterns
  """
  def get_brands do
    Data.brands()
  end

  @doc """
  Get all detailed brand data.

  ## Returns
    List of detailed brand maps
  """
  def get_brands_detailed do
    DataDetailed.brands()
  end

  @doc """
  Identify the credit card brand.

  ## Parameters
    - card_number: Credit card number as string
    - opts: Keyword list with options
      - detailed: boolean, if true returns detailed brand info (default: false)

  ## Returns
    Brand map or nil if not found. If detailed: true, includes
    :matched_pattern and :matched_bin fields.

  ## Examples

      iex> CreditcardIdentifier.find_brand("4012001037141112")
      %{name: "visa", ...}

      iex> CreditcardIdentifier.find_brand("4012001037141112", detailed: true)
      %{scheme: "visa", matched_pattern: ..., matched_bin: ...}

  """
  def find_brand(card_number, opts \\ []) do
    detailed = Keyword.get(opts, :detailed, false)
    find_brand_internal(card_number, get_brands(), detailed)
  end

  defp find_brand_internal(card_number, brands, detailed) do
    brand = Enum.find(brands, fn brand ->
      Regex.match?(brand.regexp_full, card_number)
    end)

    case brand do
      nil -> nil
      _ when detailed ->
        detailed_brands = get_brands_detailed()
        detailed_brand = Enum.find(detailed_brands, fn b -> b.scheme == brand.name end)

        case detailed_brand do
          nil -> brand
          _ ->
            # Find the specific pattern that matched
            matched_pattern = Enum.find(detailed_brand.patterns || [], fn p ->
              Regex.match?(~r/#{p.bin}/, card_number)
            end)

            # Find the specific bin that matched (if bins exist)
            bin_prefix = String.slice(card_number, 0, 6)
            matched_bin = Enum.find(detailed_brand[:bins] || [], fn b ->
              String.starts_with?(bin_prefix, b.bin) || b.bin == bin_prefix
            end)

            # Return without the full bins list
            detailed_brand
            |> Map.delete(:bins)
            |> Map.put(:matched_pattern, matched_pattern)
            |> Map.put(:matched_bin, matched_bin)
        end
      _ -> brand
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
    find_brand_internal(card_number, brands, false) != nil
  end

  @doc """
  Validate CVV for a specific brand.

  ## Parameters
    - cvv: CVV code as string
    - brand_or_name: Brand name (string) or brand map from find_brand

  ## Returns
    true if valid, false otherwise
  """
  def validate_cvv(cvv, brand_or_name) do
    validate_cvv(cvv, brand_or_name, get_brands())
  end

  @doc """
  Validate CVV for a specific brand with custom brands list.

  ## Parameters
    - cvv: CVV code as string
    - brand_or_name: Brand name (string) or brand map from find_brand
    - brands: List of brand data

  ## Returns
    true if valid, false otherwise
  """
  def validate_cvv(nil, _, _), do: false
  def validate_cvv("", _, _), do: false

  def validate_cvv(cvv, brand_or_name, brands) when is_map(brand_or_name) do
    cond do
      # Handle detailed brand object
      Map.has_key?(brand_or_name, :cvv) and is_map(brand_or_name.cvv) ->
        expected_length = brand_or_name.cvv.length
        Regex.match?(~r/^\d{#{expected_length}}$/, cvv)

      # Handle simplified brand object
      Map.has_key?(brand_or_name, :regexp_cvv) ->
        Regex.match?(brand_or_name.regexp_cvv, cvv)

      # Handle brand name from object
      Map.has_key?(brand_or_name, :name) or Map.has_key?(brand_or_name, :scheme) ->
        brand_name = brand_or_name[:name] || brand_or_name[:scheme]
        case get_brand_info(brand_name, brands) do
          nil -> false
          brand -> Regex.match?(brand.regexp_cvv, cvv)
        end

      true -> false
    end
  end

  def validate_cvv(cvv, brand_name, brands) when is_binary(brand_name) do
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
  Get detailed information about a specific brand.

  ## Parameters
    - scheme: Scheme name (e.g., "visa", "mastercard")

  ## Returns
    Detailed brand map or nil if not found
  """
  def get_brand_info_detailed(scheme) do
    Enum.find(get_brands_detailed(), fn brand -> brand.scheme == scheme end)
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
