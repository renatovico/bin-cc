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

  test "find_brand identifies Visa various cards", %{brands: _brands} do
    visa_cards = [
      "4012001037141112", "4551870000000183", "4073020000000002",
      "4012001038443335", "4024007190131", "4556523434899",
      "4477509054445560", "4146805709584576", "6367000000001022"
    ]
    for card <- visa_cards do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand != nil, "Expected Visa for #{card}"
      assert brand.name == "visa", "Expected Visa for #{card}, got #{brand.name}"
    end
  end

  test "find_brand identifies Mastercard", %{brands: _brands} do
    brand = CreditcardIdentifier.find_brand("5533798818319497")
    assert brand.name == "mastercard"
  end

  test "find_brand identifies Mastercard various cards", %{brands: _brands} do
    mastercard_cards = [
      "5533798818319497", "5437251265160938", "5101514275875158",
      "5313557320486111", "5216730016991151", "2221000000000000", "2720990000000000"
    ]
    for card <- mastercard_cards do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand != nil, "Expected Mastercard for #{card}"
      assert brand.name == "mastercard", "Expected Mastercard for #{card}"
    end
  end

  test "find_brand identifies Amex", %{brands: _brands} do
    brand = CreditcardIdentifier.find_brand("378282246310005")
    assert brand.name == "amex"
  end

  test "find_brand identifies Amex various cards", %{brands: _brands} do
    amex_cards = ["378282246310005", "376411112222331", "371449635398431", "378734493671000", "376449047333005"]
    for card <- amex_cards do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand != nil, "Expected Amex for #{card}"
      assert brand.name == "amex", "Expected Amex for #{card}"
    end
  end

  test "find_brand identifies ELO", %{brands: _brands} do
    elo_bins = [
      "4011780000000000", "4011790000000000", "4312740000000000",
      "4389350000000000", "4514160000000000", "4573930000000000",
      "4576310000000000", "4576320000000000", "5041750000000000",
      "6277800000000000", "6362970000000000", "6363680000000000",
      "5066990000000000", "5067770000000000", "5090000000000000",
      "5099980000000000", "6500310000000000", "6500350000000000",
      "6504050000000000", "6505410000000000", "6507000000000000",
      "6509010000000000", "6516520000000000", "6550000000000000"
    ]
    for card <- elo_bins do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand != nil, "Expected ELO for #{card}"
      assert brand.name == "elo", "Expected ELO for #{card}, got #{brand.name}"
    end
  end

  test "find_brand rejects invalid ELO", %{brands: _brands} do
    invalid_elo = ["4011770000000000", "4011800000000000", "5066980000000000", "6500340000000000"]
    for card <- invalid_elo do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand == nil or brand.name != "elo", "#{card} should NOT be ELO"
    end
  end

  test "find_brand identifies Aura", %{brands: _brands} do
    aura_cards = [
      "5000000000000000", "5010000000000000", "5020000000000000",
      "5030000000000000", "5040000000000000", "5050000000000000",
      "5060000000000000", "5070000000000000", "5080000000000000",
      "5078601912345600019", "5078601800003247449", "5078601870000127985"
    ]
    for card <- aura_cards do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand != nil, "Expected Aura for #{card}"
      assert brand.name == "aura", "Expected Aura for #{card}, got #{brand.name}"
    end
  end

  test "find_brand rejects invalid Aura", %{brands: _brands} do
    invalid_aura = ["510000000000000", "500000000000000", "5100000000000000"]
    for card <- invalid_aura do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand == nil or brand.name != "aura", "#{card} should NOT be Aura"
    end
  end

  test "find_brand identifies Hipercard", %{brands: _brands} do
    hipercard_bins = [
      "6062821294950895", "6062827452101536", "6062827557052048",
      "3841001111222233334", "3841401111222233334", "3841601111222233334"
    ]
    for card <- hipercard_bins do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand != nil, "Expected Hipercard for #{card}"
      assert brand.name == "hipercard", "Expected Hipercard for #{card}"
    end
  end

  test "find_brand identifies Diners", %{brands: _brands} do
    diners_cards = [
      "30066909048113", "30266056449987", "38605306210123",
      "30111122223331", "30569309025904", "38520000023237", "36490102462661"
    ]
    for card <- diners_cards do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand != nil, "Expected Diners for #{card}"
      assert brand.name == "diners", "Expected Diners for #{card}"
    end
  end

  test "find_brand rejects invalid Diners", %{brands: _brands} do
    invalid_diners = ["310000000000000", "300000000000000", "370000000000000", "390000000000000"]
    for card <- invalid_diners do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand == nil or brand.name != "diners", "#{card} should NOT be Diners"
    end
  end

  test "find_brand identifies Discover", %{brands: _brands} do
    discover_cards = ["6011236044609927", "6011091915358231", "6011726125958524", "6511020000245045"]
    for card <- discover_cards do
      brand = CreditcardIdentifier.find_brand(card)
      assert brand != nil, "Expected Discover for #{card}"
      assert brand.name == "discover", "Expected Discover for #{card}"
    end
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
