defmodule CreditcardIdentifierTest do
  use ExUnit.Case
  doctest CreditcardIdentifier

  setup do
    brands = CreditcardIdentifier.get_brands()
    {:ok, brands: brands}
  end

  test "find_brand identifies Visa", %{brands: _brands} do
    brand = CreditcardIdentifier.find_brand("4012001037141112")
    assert brand.name == "visa"
  end

  test "find_brand identifies Mastercard", %{brands: _brands} do
    brand = CreditcardIdentifier.find_brand("5533798818319497")
    assert brand.name == "mastercard"
  end

  test "find_brand identifies Amex", %{brands: _brands} do
    brand = CreditcardIdentifier.find_brand("378282246310005")
    assert brand.name == "amex"
  end

  test "find_brand with detailed returns detailed info", %{brands: _brands} do
    brand = CreditcardIdentifier.find_brand("4012001037141112", detailed: true)
    assert brand.scheme == "visa"
    assert Map.has_key?(brand, :matched_pattern)
    refute Map.has_key?(brand, :bins)
  end

  test "supported? returns true for valid cards", %{brands: brands} do
    assert CreditcardIdentifier.supported?("4012001037141112", brands)
    assert CreditcardIdentifier.supported?("5533798818319497", brands)
    assert CreditcardIdentifier.supported?("378282246310005", brands)
  end

  test "list_brands returns list of brand names", %{brands: brands} do
    brand_list = CreditcardIdentifier.list_brands(brands)
    assert is_list(brand_list)
    assert "visa" in brand_list
    assert "mastercard" in brand_list
  end

  test "get_brand_info returns brand data", %{brands: brands} do
    visa_info = CreditcardIdentifier.get_brand_info("visa", brands)
    assert visa_info != nil
    assert visa_info.name == "visa"
    assert Map.has_key?(visa_info, :regexp_bin)
    assert Map.has_key?(visa_info, :regexp_full)
    assert Map.has_key?(visa_info, :regexp_cvv)
  end

  test "get_brand_info_detailed returns detailed brand data", %{brands: _brands} do
    visa_info = CreditcardIdentifier.get_brand_info_detailed("visa")
    assert visa_info != nil
    assert visa_info.scheme == "visa"
  end

  test "validate_cvv validates Visa CVV with brand name", %{brands: brands} do
    assert CreditcardIdentifier.validate_cvv("123", "visa", brands)
    refute CreditcardIdentifier.validate_cvv("12", "visa", brands)
  end

  test "validate_cvv validates Amex CVV with brand name", %{brands: brands} do
    assert CreditcardIdentifier.validate_cvv("1234", "amex", brands)
  end

  test "validate_cvv validates CVV with brand object", %{brands: brands} do
    brand = CreditcardIdentifier.find_brand("4012001037141112")
    assert CreditcardIdentifier.validate_cvv("123", brand, brands)
    refute CreditcardIdentifier.validate_cvv("1234", brand, brands)
  end

  test "validate_cvv validates CVV with detailed brand object", %{brands: brands} do
    brand = CreditcardIdentifier.find_brand("4012001037141112", detailed: true)
    assert CreditcardIdentifier.validate_cvv("123", brand, brands)
    refute CreditcardIdentifier.validate_cvv("1234", brand, brands)
  end

  test "module-level functions work without explicit brands" do
    brand = CreditcardIdentifier.find_brand("4012001037141112")
    assert brand.name == "visa"
    assert CreditcardIdentifier.supported?("4012001037141112")
  end

  test "luhn validates valid card numbers" do
    assert CreditcardIdentifier.luhn("4012001037141112")
    assert CreditcardIdentifier.luhn("5533798818319497")
    assert CreditcardIdentifier.luhn("378282246310005")
  end

  test "luhn returns false for invalid card numbers" do
    refute CreditcardIdentifier.luhn("1234567890123456")
  end

  test "luhn returns false for empty string" do
    refute CreditcardIdentifier.luhn("")
  end

  test "luhn returns false for string with non-digits" do
    refute CreditcardIdentifier.luhn("4012-0010-3714-1112")
  end

  test "luhn raises for non-string input" do
    assert_raise ArgumentError, fn ->
      CreditcardIdentifier.luhn(4012001037141112)
    end
  end
end
