# frozen_string_literal: true

require 'minitest/autorun'
require_relative '../lib/creditcard_identifier'

class TestValidator < Minitest::Test
  def setup
    @validator = CreditcardIdentifier::Validator.new
  end

  def test_find_brand
    # Test Visa
    assert_equal 'visa', @validator.find_brand('4012001037141112')
    
    # Test Mastercard
    assert_equal 'mastercard', @validator.find_brand('5533798818319497')
    
    # Test Amex
    assert_equal 'amex', @validator.find_brand('378282246310005')
    
    # Test nil input
    assert_nil @validator.find_brand(nil)
    assert_nil @validator.find_brand('')
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
    assert_equal 'visa', visa_info['name']
    assert visa_info.key?('regexpBin')
    assert visa_info.key?('regexpFull')
    assert visa_info.key?('regexpCvv')
  end

  def test_validate_cvv
    assert @validator.validate_cvv('123', 'visa')
    assert @validator.validate_cvv('1234', 'amex')
    refute @validator.validate_cvv('12', 'visa')
  end

  def test_module_methods
    # Test module-level methods
    assert_equal 'visa', CreditcardIdentifier.find_brand('4012001037141112')
    assert CreditcardIdentifier.supported?('4012001037141112')
  end
end
