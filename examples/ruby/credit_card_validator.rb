#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'

##
# Credit Card BIN Validator - Ruby Example
#
# This class shows how to use the bin-cc data file project in Ruby.
# It loads the brands.json file and performs credit card validation.
class CreditCardValidator
  attr_reader :brands

  ##
  # Initialize validator with brand data
  #
  # @param data_path [String, nil] Path to brands.json. If nil, uses default location.
  def initialize(data_path = nil)
    data_path ||= File.join(__dir__, '../../data/brands.json')
    file_content = File.read(data_path)
    @brands = JSON.parse(file_content)
  end

  ##
  # Identify the credit card brand
  #
  # @param card_number [String] Credit card number
  # @return [String, nil] Brand name or nil if not found
  def find_brand(card_number)
    return nil if card_number.nil? || card_number.empty?

    brand = @brands.find do |b|
      pattern = Regexp.new(b['regexpFull'])
      pattern.match?(card_number)
    end

    brand ? brand['name'] : nil
  end

  ##
  # Check if card number is supported
  #
  # @param card_number [String] Credit card number
  # @return [Boolean] true if supported, false otherwise
  def supported?(card_number)
    !find_brand(card_number).nil?
  end

  ##
  # Validate CVV for a specific brand
  #
  # @param cvv [String] CVV code
  # @param brand_name [String] Brand name (e.g., 'visa', 'mastercard')
  # @return [Boolean] true if valid, false otherwise
  def validate_cvv(cvv, brand_name)
    brand = get_brand_info(brand_name)
    return false if brand.nil?

    pattern = Regexp.new(brand['regexpCvv'])
    pattern.match?(cvv)
  end

  ##
  # Get information about a specific brand
  #
  # @param brand_name [String] Brand name (e.g., 'visa', 'mastercard')
  # @return [Hash, nil] Brand hash or nil if not found
  def get_brand_info(brand_name)
    @brands.find { |b| b['name'] == brand_name }
  end

  ##
  # List all supported brands
  #
  # @return [Array<String>] List of brand names
  def list_brands
    @brands.map { |b| b['name'] }
  end
end

# Example usage
def main
  puts '=== Credit Card Validator - Ruby Example ==='
  puts

  validator = CreditCardValidator.new

  # Example 1: List all brands
  puts "Supported brands: #{validator.list_brands.join(', ')}"
  puts

  # Example 2: Identify card brands
  test_cards = {
    '4012001037141112' => 'visa',
    '5533798818319497' => 'mastercard',
    '378282246310005' => 'amex',
    '6011236044609927' => 'discover'
  }

  puts 'Card brand identification:'
  test_cards.each do |card, expected|
    brand = validator.find_brand(card)
    status = brand ? '✓' : '✗'
    puts "#{status} #{card}: #{brand} (expected: #{expected})"
  end
  puts

  # Example 3: CVV validation
  puts 'CVV validation:'
  puts "Visa CVV 123: #{validator.validate_cvv('123', 'visa')}"
  puts "Amex CVV 1234: #{validator.validate_cvv('1234', 'amex')}"
  puts "Visa CVV 12: #{validator.validate_cvv('12', 'visa')} (invalid)"
  puts

  # Example 4: Get brand details
  puts 'Visa brand details:'
  visa_info = validator.get_brand_info('visa')
  if visa_info
    puts "  BIN pattern: #{visa_info['regexpBin']}"
    puts "  Full pattern: #{visa_info['regexpFull']}"
    puts "  CVV pattern: #{visa_info['regexpCvv']}"
  else
    puts '  Not found'
  end
end

# Run the example if this file is executed directly
main if __FILE__ == $PROGRAM_NAME
