defmodule CreditcardIdentifierTest do
  use ExUnit.Case
  doctest CreditcardIdentifier

  setup do
    brands = CreditcardIdentifier.get_brands()
    {:ok, brands: brands}
  end

  test "find_brand identifies Visa", %{brands: brands} do
    assert CreditcardIdentifier.find_brand("4012001037141112", brands) == "visa"
  end

  test "find_brand identifies Mastercard", %{brands: brands} do
    assert CreditcardIdentifier.find_brand("5533798818319497", brands) == "mastercard"
  end

  test "find_brand identifies Amex", %{brands: brands} do
    assert CreditcardIdentifier.find_brand("378282246310005", brands) == "amex"
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

  test "validate_cvv validates Visa CVV", %{brands: brands} do
    assert CreditcardIdentifier.validate_cvv("123", "visa", brands)
    refute CreditcardIdentifier.validate_cvv("12", "visa", brands)
  end

  test "validate_cvv validates Amex CVV", %{brands: brands} do
    assert CreditcardIdentifier.validate_cvv("1234", "amex", brands)
  end

  test "module-level functions work without explicit brands" do
    assert CreditcardIdentifier.find_brand("4012001037141112") == "visa"
    assert CreditcardIdentifier.supported?("4012001037141112")
  end
end
