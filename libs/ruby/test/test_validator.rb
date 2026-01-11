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
