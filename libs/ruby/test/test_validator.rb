# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../lib/creditcard_identifier'

class TestValidator < Minitest::Test
  def setup
    @validator = CreditcardIdentifier::Validator.new
  end

  def test_find_brand
    # Test Visa - now returns brand object
    brand = @validator.find_brand('4012001037141112')
    assert_equal 'visa', brand[:name]
    
    # Test Mastercard
    brand = @validator.find_brand('5533798818319497')
    assert_equal 'mastercard', brand[:name]
    
    # Test Amex
    brand = @validator.find_brand('378282246310005')
    assert_equal 'amex', brand[:name]
    
    # Test nil input
    assert_nil @validator.find_brand(nil)
    assert_nil @validator.find_brand('')
  end

  def test_find_brand_elo
    elo_bins = %w[
      4011780000000000 4011790000000000 4312740000000000
      4389350000000000 4514160000000000 4573930000000000
      4576310000000000 4576320000000000 5041750000000000
      6277800000000000 6362970000000000 6363680000000000
      5066990000000000 5067770000000000 5090000000000000
      5099980000000000 6500310000000000 6500320000000000
      6500330000000000 6500350000000000 6500500000000000
      6504050000000000 6504380000000000 6504850000000000
      6505370000000000 6505410000000000 6505970000000000
      6507000000000000 6507180000000000 6507210000000000
      6507270000000000 6509010000000000 6509990000000000
      6516520000000000 6516790000000000 6550000000000000
      6550190000000000 6550210000000000 6550570000000000
    ]
    elo_bins.each do |card|
      brand = @validator.find_brand(card)
      refute_nil brand, "Expected ELO for #{card}"
      assert_equal 'elo', brand[:name], "Expected ELO for #{card}, got #{brand[:name]}"
    end
  end

  def test_find_brand_elo_invalid
    invalid_elo = %w[4011770000000000 4011800000000000 5066980000000000 6500340000000000]
    invalid_elo.each do |card|
      brand = @validator.find_brand(card)
      assert(brand.nil? || brand[:name] != 'elo', "#{card} should NOT be ELO")
    end
  end

  def test_find_brand_aura
    aura_cards = %w[
      5000000000000000 5010000000000000 5020000000000000
      5030000000000000 5040000000000000 5050000000000000
      5060000000000000 5070000000000000 5080000000000000
      5078601912345600019 5078601800003247449 5078601870000127985
    ]
    aura_cards.each do |card|
      brand = @validator.find_brand(card)
      refute_nil brand, "Expected Aura for #{card}"
      assert_equal 'aura', brand[:name], "Expected Aura for #{card}, got #{brand[:name]}"
    end
  end

  def test_find_brand_aura_invalid
    invalid_aura = %w[510000000000000 500000000000000 5100000000000000]
    invalid_aura.each do |card|
      brand = @validator.find_brand(card)
      assert(brand.nil? || brand[:name] != 'aura', "#{card} should NOT be Aura")
    end
  end

  def test_find_brand_hipercard
    hipercard_bins = %w[
      6062821294950895 6062827452101536 6062827557052048
      3841001111222233334 3841401111222233334 3841601111222233334
    ]
    hipercard_bins.each do |card|
      brand = @validator.find_brand(card)
      refute_nil brand, "Expected Hipercard for #{card}"
      assert_equal 'hipercard', brand[:name], "Expected Hipercard for #{card}"
    end
  end

  def test_find_brand_diners
    diners_cards = %w[
      30066909048113 30266056449987 38605306210123
      30111122223331 30569309025904 38520000023237 36490102462661
    ]
    diners_cards.each do |card|
      brand = @validator.find_brand(card)
      refute_nil brand, "Expected Diners for #{card}"
      assert_equal 'diners', brand[:name], "Expected Diners for #{card}"
    end
  end

  def test_find_brand_diners_invalid
    invalid_diners = %w[310000000000000 300000000000000 3060000000000000 370000000000000 390000000000000]
    invalid_diners.each do |card|
      brand = @validator.find_brand(card)
      assert(brand.nil? || brand[:name] != 'diners', "#{card} should NOT be Diners")
    end
  end

  def test_find_brand_discover
    discover_cards = %w[6011236044609927 6011091915358231 6011726125958524 6511020000245045]
    discover_cards.each do |card|
      brand = @validator.find_brand(card)
      refute_nil brand, "Expected Discover for #{card}"
      assert_equal 'discover', brand[:name], "Expected Discover for #{card}"
    end
  end

  def test_find_brand_mastercard
    mastercard_cards = %w[
      5533798818319497 5437251265160938 5101514275875158
      5313557320486111 5216730016991151 2221000000000000 2720990000000000
    ]
    mastercard_cards.each do |card|
      brand = @validator.find_brand(card)
      refute_nil brand, "Expected Mastercard for #{card}"
      assert_equal 'mastercard', brand[:name], "Expected Mastercard for #{card}"
    end
  end

  def test_find_brand_visa
    visa_cards = %w[
      4012001037141112 4551870000000183 4073020000000002
      4012001038443335 4024007190131 4556523434899
      4477509054445560 4146805709584576 6367000000001022
    ]
    visa_cards.each do |card|
      brand = @validator.find_brand(card)
      refute_nil brand, "Expected Visa for #{card}"
      assert_equal 'visa', brand[:name], "Expected Visa for #{card}"
    end
  end

  def test_find_brand_detailed
    brand = @validator.find_brand('4012001037141112', detailed: true)
    refute_nil brand
    assert_equal 'visa', brand[:scheme]
    assert brand.key?(:matched_pattern)
    refute brand.key?(:bins)
  end

  def test_supported
    assert @validator.supported?('4012001037141112')
    assert @validator.supported?('5533798818319497')
    assert @validator.supported?('378282246310005')
  end

  def test_list_brands
    brands = @validator.list_brands
    assert_kind_of Array, brands
    assert_includes brands, 'visa'
    assert_includes brands, 'mastercard'
  end

  def test_get_brand_info
    visa_info = @validator.get_brand_info('visa')
    refute_nil visa_info
    assert_equal 'visa', visa_info[:name]
    assert visa_info.key?(:regexp_bin)
    assert visa_info.key?(:regexp_full)
    assert visa_info.key?(:regexp_cvv)
  end

  def test_get_brand_info_detailed
    visa_info = @validator.get_brand_info_detailed('visa')
    refute_nil visa_info
    assert_equal 'visa', visa_info[:scheme]
  end

  def test_validate_cvv_with_name
    assert @validator.validate_cvv('123', 'visa')
    assert @validator.validate_cvv('1234', 'amex')
    refute @validator.validate_cvv('12', 'visa')
  end

  def test_validate_cvv_with_brand_object
    brand = @validator.find_brand('4012001037141112')
    assert @validator.validate_cvv('123', brand)
    refute @validator.validate_cvv('1234', brand)
  end

  def test_validate_cvv_with_detailed_brand
    brand = @validator.find_brand('4012001037141112', detailed: true)
    assert @validator.validate_cvv('123', brand)
    refute @validator.validate_cvv('1234', brand)
  end

  def test_module_methods
    # Test module-level methods - now return brand object
    brand = CreditcardIdentifier.find_brand('4012001037141112')
    assert_equal 'visa', brand[:name]
    assert CreditcardIdentifier.supported?('4012001037141112')
    
    # Test validate_cvv module method
    assert CreditcardIdentifier.validate_cvv('123', 'visa')
    assert CreditcardIdentifier.validate_cvv('123', brand)
  end

  def test_luhn_valid_cards
    # Valid card numbers
    assert CreditcardIdentifier.luhn('4012001037141112')
    assert CreditcardIdentifier.luhn('5533798818319497')
    assert CreditcardIdentifier.luhn('378282246310005')
  end

  def test_luhn_invalid_cards
    # Invalid card numbers
    refute CreditcardIdentifier.luhn('1234567890123456')
  end

  def test_luhn_empty_string
    refute CreditcardIdentifier.luhn('')
  end

  def test_luhn_non_digits
    # String with non-digits
    refute CreditcardIdentifier.luhn('4012-0010-3714-1112')
  end

  def test_luhn_non_string_raises
    assert_raises(TypeError) { CreditcardIdentifier.luhn(4012001037141112) }
  end

  def test_luhn_validator_method
    assert @validator.luhn('4012001037141112')
    refute @validator.luhn('1234567890123456')
  end
end
